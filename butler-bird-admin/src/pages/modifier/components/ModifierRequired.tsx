import React, { ChangeEvent, FC, memo } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  FormLabel,
} from "@material-ui/core";
import style from "styles/pages/modifier/components/ModifierRequired.module.scss";
import { useField } from "formik";
import { Radio } from "components/Radio";

interface Props {
  name: string;
}

export const ModifierRequired: FC<Props> = memo(function ModifierRequired(
  props
) {
  const { field, handleChange } = useModifierRequired(props);
  const { t } = useTranslation();

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" className={style.label}>
        {t("pages.modifier.required")}
      </FormLabel>
      <RadioGroup {...field} value={field.value ?? ""} onChange={handleChange}>
        <FormControlLabel
          classes={{ label: style.radioLabel, root: style.radioRoot }}
          value="true"
          control={<Radio />}
          label={t("pages.modifier.yes")}
        />
        <FormControlLabel
          classes={{ label: style.radioLabel, root: style.radioRoot }}
          value="false"
          control={<Radio />}
          label={t("pages.modifier.no")}
        />
      </RadioGroup>
    </FormControl>
  );
});

function useModifierRequired({ name }: Props) {
  const [field, , { setValue }] = useField(name);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.currentTarget.value);
  }

  return { field, handleChange };
}
