import React, { FC, memo, ReactElement, ReactNode, useMemo, cloneElement } from "react";
import { Typography, useTheme } from "@material-ui/core";
import style from "styles/components/success.module.scss";
import { get } from "lodash";
import classNames from "classnames";

type Props = {
  icon: ReactElement;
  message: string;
  mainButton?: ReactNode;
  secondButton?: ReactNode;
  textClassName?: string;
  customColor?: string;
};

export const Message: FC<Props> = memo(function Success({
  icon,
  message,
  mainButton,
  secondButton,
  textClassName,
  customColor,
}) {
  const { themeColor } = useSuccess();

  return (
    <div className={style.success}>
      {cloneElement(icon, {
        style: { color: customColor ?? themeColor },
        className: style.icon,
      })}
      <Typography className={classNames(style.text, textClassName)}>{message}</Typography>
      {mainButton}
      {secondButton}
    </div>
  );
});

function useSuccess() {
  const theme = useTheme();

  const themeColor = useMemo(() => {
    return get(theme, "palette.primary.main");
  }, [theme]);

  return { themeColor };
}
