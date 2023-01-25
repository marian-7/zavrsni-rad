import React, { FC, memo, ReactNode } from "react";
import { FormControlLabel, Radio as MuiRadio, RadioProps } from "@material-ui/core";
import style from "styles/components/radio.module.scss";
import { ReactComponent as RadioIcon } from "assets/icons/radio.svg";
import { ReactComponent as SelectedIcon } from "assets/icons/radio-checked.svg";
import classNames from "classnames";

type Props = RadioProps & {
  label: ReactNode;
  noLine?: boolean;
  radioClassName?: string;
};

export const Radio: FC<Props> = memo(function Radio(props) {
  useRadio();
  const { label, value, noLine, className, radioClassName, ...rest } = props;

  return (
    <FormControlLabel
      value={value}
      className={classNames(style.root, className)}
      classes={{
        label: style.label,
      }}
      control={
        <MuiRadio
          icon={<RadioIcon />}
          color="primary"
          checkedIcon={<SelectedIcon />}
          classes={{
            root: classNames(radioClassName),
          }}
          {...rest}
        />
      }
      label={label}
    />
  );
});

function useRadio() {}
