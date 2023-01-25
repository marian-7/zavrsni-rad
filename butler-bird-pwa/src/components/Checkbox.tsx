import React, { FC, memo, ReactNode } from "react";
import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormControlLabel,
  InputProps,
} from "@material-ui/core";
import style from "styles/components/checkbox.module.scss";
import { ReactComponent as CheckedIcon } from "assets/icons/checkbox-checked.svg";
import { ReactComponent as CheckboxIcon } from "assets/icons/checkbox.svg";

type Props = CheckboxProps & {
  label: ReactNode;
  index?: number;
};

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  InputProps & {
    [key: string]: number | undefined;
  };

export const Checkbox: FC<Props> = memo(function Checkbox(props) {
  useCheckbox();
  const { label, className, index, ...rest } = props;

  const inputProps: CustomInputProps = { "data-index": index };

  return (
    <FormControlLabel
      classes={{
        root: style.root,
        label: style.label,
      }}
      className={className}
      control={
        <MuiCheckbox
          icon={<CheckboxIcon />}
          checkedIcon={<CheckedIcon />}
          color="primary"
          classes={{
            root: style.checkbox,
            colorPrimary: style.icon,
          }}
          inputProps={inputProps}
          {...rest}
        />
      }
      label={label}
    />
  );
});

function useCheckbox() {}
