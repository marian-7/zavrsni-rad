import React, { FC, memo } from "react";
import style from "styles/components/SinglePageHeader.module.scss";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import flex from "styles/util/flex.module.scss";
import classNames from "classnames";

interface Props {}

export const SettingsCurrencyHeader: FC<Props> = memo(
  function SettingsCurrencyHeader() {
    useSettingsCurrencyHeader();
    const { t } = useTranslation();

    return (
      <div
        className={classNames(
          style.header,
          flex.flexDirectionColumn,
          flex.alignItemsStart
        )}
      >
        <Typography className={style.label}>
          {t("pages.settings.list.currency.title")}
        </Typography>
        <Typography>{t("pages.settings.list.currency.label")}</Typography>
      </div>
    );
  }
);

function useSettingsCurrencyHeader() {}
