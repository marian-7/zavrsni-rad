import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  FormLabel,
} from "@material-ui/core";
import style from "styles/pages/modifier/components/ModifierType.module.scss";
import { useField } from "formik";
import { Radio } from "components/Radio";
import { ReactComponent as CheckboxIcon } from "assets/icons/check-box.svg";
import { ReactComponent as CheckOutlineIcon } from "assets/icons/check-outline.svg";
import { SelectionMode } from "../../../domain/models/OptionGroup";

interface Props {
  name: string;
}

export const ModifierType: FC<Props> = memo(function ModifierType(props) {
  const { field } = useModifierType(props);
  const { t } = useTranslation();

  return (
    <FormControl component="fieldset" fullWidth classes={{ root: style.root }}>
      <FormLabel component="legend" className={style.label}>
        {t("pages.modifier.type")}
      </FormLabel>
      <RadioGroup {...field}>
        <FormControlLabel
          classes={{ label: style.radioLabel, root: style.radioRoot }}
          value={SelectionMode.Single}
          control={<Radio />}
          label={t("pages.modifier.single")}
        />
        <FormControlLabel
          classes={{ label: style.radioLabel, root: style.radioRoot }}
          value={SelectionMode.Multiple}
          control={
            <Radio
              icon={<CheckOutlineIcon className="MuiSvgIcon-root" />}
              checkedIcon={<CheckboxIcon className="MuiSvgIcon-root" />}
            />
          }
          label={t("pages.modifier.multiple")}
        />
      </RadioGroup>
    </FormControl>
  );
});

function useModifierType({ name }: Props) {
  const [field] = useField(name);

  return { field };
}
