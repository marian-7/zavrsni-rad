import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@material-ui/core";
import { Button } from "components/Button";
import style from "styles/components/SinglePageHeader.module.scss";

type Props = {
  loading?: boolean;
};

export const SettingsThemesHeader: FC<Props> = memo(
  function SettingsThemesHeader({ loading }) {
    const { t } = useSettingsThemesHeader();

    return (
      <div className={style.header}>
        <div className="flex-1 flex-direction-column align-self-stretch">
          <Typography className={style.label}>
            {t("pages.settings.list.themes.title")}
          </Typography>
          <Typography>{t("pages.settings.list.themes.label")}</Typography>
        </div>
        <Button
          color="primary"
          variant="contained"
          className={style.save}
          type="submit"
          loading={loading}
        >
          {t("buttons.saveChanges")}
        </Button>
      </div>
    );
  }
);

function useSettingsThemesHeader() {
  const { t } = useTranslation();
  return { t };
}
