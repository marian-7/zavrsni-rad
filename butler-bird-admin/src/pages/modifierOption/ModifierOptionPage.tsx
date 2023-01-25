import React, { FC, memo, useCallback, useMemo } from "react";
import { SidePage } from "components/SidePage";
import { useTranslation } from "react-i18next";
import {
  ModifierOptionForm,
  ModifierOptionFormValues,
} from "pages/modifierOptions/components/ModifierOptionForm";
import { paths, withSlug } from "paths";
import { useHistory, useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { ReactComponent as BackIcon } from "assets/icons/arrow-back.svg";
import { Formik, useField } from "formik";
import { mapTranslation } from "domain/util/formik";
import { useOrganization } from "hooks/useOrganization";
import { modifierOptionSchema } from "domain/util/validators";
import { optionService, UpdateOptionData } from "domain/services/optionService";
import { useMutation } from "react-query";
import { Option, OptionGroup } from "domain/models/OptionGroup";
import { mapData } from "domain/util/axios";
import { nextTick } from "util/nextTick";

type Props = {};

export const ModifierOptionPage: FC<Props> = memo(function ModifierItem() {
  const {
    t,
    backTo,
    handleStartIconClick,
    handleOptionUpdate,
    handleOptionDelete,
    initialValues,
    removing,
  } = useModifierItem();

  return (
    <SidePage
      title={t("pages.modifierItem.title")}
      to={backTo}
      startIcon={<BackIcon />}
      onStartIconClick={handleStartIconClick}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleOptionUpdate}
        enableReinitialize
        validationSchema={modifierOptionSchema}
      >
        <ModifierOptionForm
          optionEdit
          onOptionDelete={handleOptionDelete}
          removing={removing}
        />
      </Formik>
    </SidePage>
  );
});

function useModifierItem() {
  const { t } = useTranslation();
  const history = useHistory();
  const organization = useOrganization();
  const params = useParams<{
    modifier: string;
    option: string;
    item?: string;
  }>();
  const itemId = params.item ? toNumber(params.item) : undefined;
  const modifierId = toNumber(params.modifier);
  const optionId = toNumber(params.option);
  const [{ value: optionGroups }, , { setValue }] = useField<OptionGroup[]>(
    "optionGroups"
  );

  const optionGroup = optionGroups?.find((og) => og.id === modifierId);
  const option = optionGroup?.options.find((o) => o.id === optionId);

  const { mutateAsync: update } = useMutation<
    Option,
    unknown,
    UpdateOptionData
  >(
    (data) => {
      return optionService.update(data).then(mapData);
    },
    {
      onSuccess: (data) => {
        const updatedOptionsGroups = optionGroups.map((og) => {
          if (og.id !== modifierId) {
            return og;
          }
          return {
            ...og,
            options: og.options.map((o) => (o.id === data.id ? data : o)),
          };
        });
        setValue(updatedOptionsGroups);
        nextTick(() => history.goBack());
      },
    }
  );

  const { mutateAsync: remove, isLoading: removing } = useMutation<
    unknown,
    unknown,
    number
  >(
    (data) => {
      return optionService.remove(data);
    },
    {
      onSuccess: () => {
        const updatedOptionsGroups = optionGroups.map((og) => {
          if (og.id !== modifierId) {
            return og;
          }
          return {
            ...og,
            options: og.options.filter((o) => o.id !== optionId),
          };
        });
        setValue(updatedOptionsGroups);
        nextTick(() => history.goBack());
      },
    }
  );

  const initialValues = useMemo(() => {
    const name = mapTranslation(organization?.languages, option?.name);
    const description = mapTranslation(
      organization?.languages,
      option?.description
    );

    return {
      name: name,
      description: description,
      price: option?.price,
    };
  }, [
    option?.name,
    option?.description,
    option?.price,
    organization?.languages,
  ]);

  const handleOptionUpdate = useCallback(
    (optionValues: ModifierOptionFormValues) =>
      update({ ...optionValues, id: optionId }),
    [optionId, update]
  );

  const handleOptionDelete = useCallback(() => remove(optionId), [
    optionId,
    remove,
  ]);

  const backTo = itemId
    ? withSlug(paths.item(itemId, paths.modifiers()))
    : withSlug(paths.itemCreate(paths.modifiers()));

  const handleStartIconClick = useCallback(() => {
    history.goBack();
  }, [history]);

  return {
    t,
    backTo,
    handleStartIconClick,
    handleOptionUpdate,
    handleOptionDelete,
    initialValues,
    removing,
  };
}
