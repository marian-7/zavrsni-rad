import React, { FC, memo } from "react";
import style from "styles/components/SinglePageHeader.module.scss";
import { Typography } from "@material-ui/core";
import { Button } from "components/Button";
import { useTranslation } from "react-i18next";

interface Props {
  isSubmitting: boolean;
}

export const SettingsOrganizationHeader: FC<Props> = memo(
  function SettingsOrganizationHeader({ isSubmitting }) {
    useSettingsOrganizationHeader();
    const { t } = useTranslation();

    return (
      <div className={style.header}>
        <div className="flex-1 flex-direction-column align-self-stretch">
          <Typography className={style.label}>
            {t("pages.settings.list.organization.title")}
          </Typography>
          <Typography>{t("pages.settings.list.organization.label")}</Typography>
        </div>
        <Button
          color="primary"
          variant="contained"
          className={style.save}
          type="submit"
          loading={isSubmitting}
        >
          {t("buttons.saveChanges")}
        </Button>
      </div>
    );
  }
);

function useSettingsOrganizationHeader() {}
