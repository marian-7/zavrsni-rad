import React, { FC, memo, ReactNode } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import style from "styles/components/input.module.scss";

type Props = TextFieldProps & {
  endAdornment?: ReactNode;
};

export const Input: FC<Props> = memo(function Input(props) {
  const { color, endAdornment, className, ...rest } = props;
  useInput();

  return (
    <>
      <TextField
        classes={{ root: style.root }}
        className={className}
        InputProps={{
          classes: {
            root: style.inputRoot,
            input: style.input,
          },
          endAdornment,
        }}
        InputLabelProps={{
          classes: {
            root: style.label,
          },
        }}
        {...rest}
      />
    </>
  );
});

function useInput() {}
