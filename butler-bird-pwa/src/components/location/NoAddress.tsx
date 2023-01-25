import React, { FC, memo } from "react";
import style from "styles/components/autocomplete-result.module.scss";
import { Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useTranslation } from "next-i18next";
import classNames from "classnames";

type Props = {
  handleRedirect: () => void;
};

export const NoAddress: FC<Props> = memo(function NoAddress({ handleRedirect }) {
  useNoAddress();
  const { t } = useTranslation("location");

  return (
    <div className={classNames(style.root, style.noAddress)} onClick={handleRedirect}>
      <Typography className={style.label}>{t("searchResult.missingAddress")}</Typography>
      <div className={style.bottom}>
        <Typography>{t("searchResult.showMap")}</Typography>
        <ArrowForwardIosIcon className={style.icon} />
      </div>
    </div>
  );
});

function useNoAddress() {}
