import React, { ChangeEvent, FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { FormControl, FormControlLabel, FormLabel } from "@material-ui/core";
import style from "styles/pages/modifier/components/ModifierReuse.module.scss";
import { useField } from "formik";
import { Checkbox } from "components/Checkbox";
import { AccessLevel } from "../../../domain/models/OptionGroup";

interface Props {
  name: string;
}

export const ModifierReuse: FC<Props> = memo(function ModifierReuse(props) {
  const { field, handleChange } = useModifierReuse(props);
  const { t } = useTranslation();

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" className={style.label}>
        {t("pages.modifier.reuse")}
      </FormLabel>
      <FormControlLabel
        classes={{ label: style.checkboxLabel, root: style.checkboxRoot }}
        control={
          <Checkbox
            {...field}
            onChange={handleChange}
            checked={field.value === AccessLevel.Organization}
          />
        }
        label={t("pages.modifier.reuseCheckbox")}
      />
    </FormControl>
  );
});

function useModifierReuse({ name }: Props) {
  const [field, , { setValue }] = useField(name);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.checked ? AccessLevel.Organization : AccessLevel.Item);
  }

  return { field, handleChange };
}
