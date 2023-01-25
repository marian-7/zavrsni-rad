import React, { FC, memo, useCallback, useMemo } from "react";
import { Formik, useField } from "formik";
import { mapTranslation } from "domain/util/formik";
import { useOrganization } from "hooks/useOrganization";
import {
  ModifierOptionForm,
  ModifierOptionFormValues,
} from "pages/modifierOptions/components/ModifierOptionForm";
import { useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { modifierOptionSchema } from "domain/util/validators";
import { OptionGroup } from "domain/models/OptionGroup";
import { useMutation } from "react-query";
import { mapData } from "domain/util/axios";
import { optionGroupsService } from "domain/services/optionGroupsService";
import { nextTick } from "util/nextTick";
import { CreateOptionData, optionService } from "domain/services/optionService";

type Props = {
  onOptionAdded: () => void;
};

export const ModifierOptionAdd: FC<Props> = memo(function ModifierOptionAdd(
  props
) {
  const { initialValues, handleSubmit } = useModifierOptionAdd(props);

  return (
    <Formik<ModifierOptionFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={modifierOptionSchema}
      enableReinitialize
    >
      <ModifierOptionForm />
    </Formik>
  );
});

function useModifierOptionAdd({ onOptionAdded }: Props) {
  const organization = useOrganization();
  const params = useParams<{ modifier: string }>();
  const modifierId = toNumber(params.modifier);
  const [{ value: optionGroups }, , { setValue }] = useField<OptionGroup[]>(
    "optionGroups"
  );
  const optionGroup = optionGroups.find((og) => og.id === modifierId);

  const { mutateAsync } = useMutation<OptionGroup, unknown, CreateOptionData>(
    async (data) => {
      const { data: option } = await optionService.create(data);
      return optionGroupsService
        .update({
          id: modifierId,
          options: optionGroup?.options.concat([option]) ?? [option],
        })
        .then(mapData);
    },
    {
      onSuccess: (data) => {
        if (optionGroup) {
          setValue(optionGroups.map((og) => (og.id === data.id ? data : og)));
        } else {
          setValue(optionGroups.concat(data));
        }
        nextTick(() => onOptionAdded());
      },
    }
  );

  const initialValues = useMemo(() => {
    return {
      name: mapTranslation(organization?.languages),
      description: mapTranslation(organization?.languages),
      price: undefined,
    };
  }, [organization?.languages]);

  const handleSubmit = useCallback(
    (optionValues: ModifierOptionFormValues) => {
      return mutateAsync({
        ...optionValues,
        price: optionValues.price ?? 0,
      });
    },
    [mutateAsync]
  );

  return { initialValues, handleSubmit };
}
