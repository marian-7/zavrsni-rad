import { FC, memo, useCallback } from "react";
import style from "styles/pages/settingsThemes/components/ThemeTile.module.scss";
import { Typography } from "@material-ui/core";
import { Button } from "components/Button";
import { useTranslation } from "react-i18next";
import { useFormikContext } from "formik";
import {
  ThemeFormValues,
  ThemeStyle,
} from "pages/settingsThemes/SettingsThemesPage";
import { useTheme } from "hooks/useTheme";

type Props = {
  theme: ThemeStyle;
  setCurrentPreview: (value: ThemeStyle) => void;
  selected?: boolean;
};

export const ThemeTile: FC<Props> = memo(function ThemeTile(props) {
  const { theme, selected } = props;
  const { t, handleSelect } = useThemeTile(props);

  return (
    <div className={style.tile}>
      {theme.theme}
      <div className={style.separator} />
      <div className={style.actions}>
        <Typography className={style.actionsName}>{theme.name}</Typography>
        {/*<IconButton className={style.actionsIcon} onClick={handlePreview}>
          <VisibilityIcon />
        </IconButton>*/}
        <Button
          variant="contained"
          color="primary"
          className={style.actionsSelect}
          disabled={selected}
          onClick={handleSelect}
        >
          {selected ? t("buttons.selected") : t("buttons.select")}
        </Button>
      </div>
    </div>
  );
});

function useThemeTile({ theme, setCurrentPreview }: Props) {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<ThemeFormValues>();
  const { setStyle } = useTheme();

  const handlePreview = useCallback(() => {
    setCurrentPreview(theme);
  }, [setCurrentPreview, theme]);

  const handleSelect = useCallback(() => {
    setStyle(theme.id);
    setFieldValue("style", theme.id);
  }, [setFieldValue, setStyle, theme.id]);

  return { t, handleSelect, handlePreview };
}
