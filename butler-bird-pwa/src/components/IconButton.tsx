import React, { FC, memo, useMemo } from "react";
import style from "styles/components/icon-button.module.scss";
import { IconButton as MuiIconButton, IconButtonProps, useTheme } from "@material-ui/core";

type Props = IconButtonProps & {};

const disabledBackground = "#D8D8D8";
const disabledText = "#797575";

export const IconButton: FC<Props> = memo(function IconButton({ ...props }) {
  const { primaryColor, contrastText } = useIconButton();
  const { disabled } = props;

  return (
    <MuiIconButton
      classes={{
        root: style.root,
        disabled: style.disabled,
      }}
      style={{
        backgroundColor: disabled ? disabledBackground : primaryColor,
        color: disabled ? disabledText : contrastText,
      }}
      {...props}
    />
  );
});

function useIconButton() {
  const theme = useTheme();

  const primaryColor = useMemo(() => {
    return theme.palette.primary.main;
  }, [theme.palette.primary.main]);

  const contrastText = useMemo(() => {
    return theme.palette.primary.contrastText;
  }, [theme.palette.primary.contrastText]);

  return { primaryColor, contrastText };
}
