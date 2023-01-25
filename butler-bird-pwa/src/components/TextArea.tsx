import React, { FC, memo } from "react";
import TextField from "@material-ui/core/TextField";
import { TextFieldProps } from "@material-ui/core";
import style from "styles/components/text-area.module.scss";

type Props = TextFieldProps & {};

export const TextArea: FC<Props> = memo(function TextArea(props) {
  const { ...rest } = props;
  useTextArea();

  return (
    <TextField
      multiline
      {...rest}
      classes={{
        root: style.root,
      }}
      InputProps={{
        classes: {
          root: style.inputRoot,
        },
      }}
      InputLabelProps={{
        classes: {
          root: style.label,
        },
        shrink: true,
      }}
    />
  );
});

function useTextArea() {}
