import { IconButton, Typography, useTheme } from "@material-ui/core";
import React, { FC, memo, useMemo } from "react";
import { Button } from "components/Button";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "next-i18next";
import { ReactComponent as CancelIcon } from "assets/icons/cancel-icon.svg";
import style from "styles/components/welcome/invalid-table.module.scss";
import { get } from "lodash";

type Props = {
  onClose: () => void;
};

export const InvalidTable: FC<Props> = memo(function InvalidTable(props) {
  const { themeColor } = useInvalidTable();
  const { t } = useTranslation("index");
  const { onClose } = props;

  return (
    <div className={style.root}>
      <IconButton children={<CloseIcon />} className={style.closeBtn} onClick={onClose} />
      <CancelIcon style={{ color: themeColor }} className={style.icon} />
      <Typography className={style.text}>{t("error.tableNumber")}</Typography>
      <Button variant="contained" color="primary" className={style.button} onClick={onClose}>
        {t("button.understand")}
      </Button>
    </div>
  );
});

function useInvalidTable() {
  const theme = useTheme();

  const themeColor = useMemo(() => {
    return get(theme, "palette.primary.main");
  }, [theme]);

  return { themeColor };
}
