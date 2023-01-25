import React, { FC, memo } from "react";
import { Button } from "./Button";
import { ButtonProps } from "@material-ui/core";
import style from "styles/components/button-with-icon.module.scss";

type Props = ButtonProps & {};

export const ButtonWithIcon: FC<Props> = memo(function ButtonWithIcon(props) {
  useButtonWithIcon();

  return (
    <Button
      {...props}
      classes={{
        root: style.button,
        startIcon: style.icon,
        label: style.label,
      }}
    />
  );
});

function useButtonWithIcon() {}
