import React, { FC, memo, useMemo } from "react";
import { Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import style from "styles/components/banner.module.scss";
import { useRouter } from "next/router";
import { IconButton } from "@material-ui/core";
import { useTheme } from "context/ThemeContext";
import { get } from "lodash";

type Props = {
  message: Record<string, string>;
  closeBanner: () => void;
};

export const Banner: FC<Props> = memo(function Banner({ message, closeBanner }) {
  const { themeColor } = useBanner();
  const { locale } = useRouter();

  return (
    <div className={style.root} style={{ background: themeColor }}>
      <Typography>{message[locale!]}</Typography>
      <IconButton children={<CloseIcon />} className={style.button} onClick={closeBanner} />
    </div>
  );
});

function useBanner() {
  const theme = useTheme();

  const themeColor = useMemo(() => get(theme, "theme.palette.primary.light"), [theme]);

  return { themeColor };
}
