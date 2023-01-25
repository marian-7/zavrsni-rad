import React, { FC, memo, useCallback, useMemo } from "react";
import { SidePage } from "components/SidePage";
import { useTranslation } from "react-i18next";
import { Formik, useField } from "formik";
import { useOrganization } from "hooks/useOrganization";
import { paths, withSlug } from "paths";
import { useHistory, useParams } from "react-router-dom";
import { toNumber, uniqBy } from "lodash";
import { mapTranslation } from "domain/util/formik";
import {
  ModifierCreateFormValues,
  ModifierForm,
} from "pages/modifier/components/ModifierForm";
import { modifierSchema } from "domain/util/validators";
import {
  AccessLevel,
  OptionGroup,
  SelectionMode,
} from "domain/models/OptionGroup";
import { useMutation, useQueryClient } from "react-query";
import {
  CreateOptionGroupData,
  optionGroupsService,
} from "domain/services/optionGroupsService";
import { mapData } from "domain/util/axios";
import { nextTick } from "util/nextTick";

interface Props {}

export const ModifierPage: FC<Props> = memo(function ModifierPage() {
  const { backTo, initialValues, handleSubmit, t } = useModifierPage();

  return (
    <SidePage to={backTo} title={t("pages.modifier.title")}>
      <Formik<ModifierCreateFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={modifierSchema}
      >
        <ModifierForm />
      </Formik>
    </SidePage>
  );
});

function useModifierPage() {
  const { t } = useTranslation();
  const { push } = useHistory();
  const organization = useOrganization();
  const params = useParams<{ item?: string; modifier?: string }>();
  const item = params.item ? toNumber(params.item) : undefined;
  const optionGroup = params.modifier ? toNumber(params.modifier) : undefined;
  const [{ value }, , { setValue }] = useField<OptionGroup[]>("optionGroups");
  const qc = useQueryClient();

  const { mutateAsync } = useMutation<
    OptionGroup,
    unknown,
    CreateOptionGroupData
  >(
    async (data) => {
      return optionGroupsService.create(data).then(mapData);
    },
    {
      onSuccess: (data) => {
        setValue(uniqBy([data].concat(value), "id"));
        if (data.accessLevel === AccessLevel.Organization) {
          qc.setQueryData<OptionGroup[]>("optionGroups", (old) => {
            return old?.concat(data) ?? [data];
          });
        }

        let path = "";
        if (item) {
          path = withSlug(
            paths.item(item, paths.modifier(data.id, paths.modifierOptions()))
          );
        } else {
          path = withSlug(
            paths.itemCreate(paths.modifier(data.id, paths.modifierOptions()))
          );
        }
        nextTick(() => push(path));
      },
    }
  );

  const initialValues = useMemo(() => {
    const selectedOptionGroup = value.find(
      (g) => g.id?.toString() === optionGroup
    );
    if (selectedOptionGroup) {
      return selectedOptionGroup;
    }

    return {
      name: mapTranslation(organization?.languages),
      description: mapTranslation(organization?.languages),
      selectionMode: SelectionMode.Multiple,
      required: "true",
      options: [],
      accessLevel: AccessLevel.Item,
    };
  }, [optionGroup, organization?.languages, value]);

  const backTo = item
    ? withSlug(paths.item(item))
    : withSlug(paths.itemCreate());

  const handleSubmit = useCallback(
    (modifierValues: ModifierCreateFormValues) =>
      mutateAsync({
        ...modifierValues,
        required: modifierValues.required === "true",
      }),
    [mutateAsync]
  );

  return { backTo, initialValues, handleSubmit, t };
}
