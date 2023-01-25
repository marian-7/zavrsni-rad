import React, {
  FC,
  memo,
  ReactComponentElement,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Formik } from "formik";
import singlePageStyle from "styles/components/SinglePage.module.scss";
import { SettingsThemesHeader } from "pages/settingsThemes/components/SettingsThemesHeader";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import style from "styles/pages/settingsThemes/SettingsThemesPage.module.scss";
import { ThemeTile } from "pages/settingsThemes/components/ThemeTile";
import { ReactComponent as ThemeAdmin } from "assets/themes/theme-admin.svg";
import { useOrganization } from "hooks/useOrganization";
import { ReactComponent as ThemeMobile } from "assets/themes/theme-mobile.svg";
import { useMutation, useQueryClient } from "react-query";
import { organizationService } from "domain/services/organizationService";
import { ThemePreviewOverlay } from "pages/settingsThemes/components/ThemePreviewOverlay";
import { AxiosResponse } from "axios";
import { Organization, Style } from "domain/models/Organization";
import { themeColors } from "providers/ThemeProvider";
import { useTheme } from "hooks/useTheme";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Form } from "components/Form";

export interface ThemeFormValues {
  style: Style;
}

export interface ThemeStyle {
  id: Style;
  name: string;
  theme: ReactComponentElement<any>;
  preview: ReactElement;
}

type Props = {};

export const SettingsThemesPage: FC<Props> = memo(function SettingsThemePage() {
  const {
    t,
    themeStyles,
    initialValues,
    handleSubmit,
    isLoading,
    currentPreview,
    handleClickLeft,
    handleClickRight,
    setCurrentPreview,
    handleOverlayClose,
  } = useSettingsThemesPage();

  function renderThemeStyle(selectedTheme: string) {
    return function (theme: ThemeStyle) {
      return (
        <ThemeTile
          key={theme.id}
          theme={theme}
          setCurrentPreview={setCurrentPreview}
          selected={theme.id === selectedTheme}
        />
      );
    };
  }

  return (
    <OverlayScrollbarsComponent
      className={singlePageStyle.container}
      options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
    >
      <Formik<ThemeFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values }) => {
          return (
            <Form className={singlePageStyle.form}>
              <SettingsThemesHeader loading={isLoading} />
              <div className={singlePageStyle.body}>
                <Typography
                  className={classNames(singlePageStyle.subtitle, "mb-3")}
                >
                  {t("pages.settings.list.themes.chooseLook")}
                </Typography>
                <div className={style.themes}>
                  {themeStyles.map(renderThemeStyle(values.style))}
                </div>
              </div>
              {currentPreview && (
                <ThemePreviewOverlay
                  preview={currentPreview?.preview!}
                  onClose={handleOverlayClose}
                  onClickLeft={handleClickLeft}
                  onClickRight={handleClickRight}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </OverlayScrollbarsComponent>
  );
});

function useSettingsThemesPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const organization = useOrganization();
  const { setStyle } = useTheme();
  const [currentPreview, setCurrentPreview] = useState<
    ThemeStyle | undefined
  >();

  const initialValues = useMemo(() => {
    return {
      style: organization?.style ?? Style.Style1,
    };
  }, [organization?.style]);

  const handleOverlayClose = useCallback(() => {
    setCurrentPreview(undefined);
  }, []);

  const handleSuccess = useCallback(
    ({ data }: AxiosResponse<Organization>) => {
      qc.setQueryData<Organization>(
        ["organizations", organization?.slug],
        data
      );
    },
    [organization?.slug, qc]
  );

  const {
    mutateAsync: updateStyle,
    isLoading,
  } = useMutation(organizationService.update, { onSuccess: handleSuccess });

  const handleSubmit = useCallback(
    ({ style }: ThemeFormValues) => {
      if (organization?.id) {
        const data = { id: organization.id, style };
        return updateStyle(data).catch(() => {});
      }
    },
    [organization?.id, updateStyle]
  );

  const themeStyles: ThemeStyle[] = useMemo(
    () => [
      {
        id: Style.Style1,
        name: t("themes.purple"),
        theme: <ThemeAdmin className={classNames(style.theme, style.purple)} />,
        preview: (
          <ThemeMobile
            className={classNames(style.preview, style.previewPurple)}
          />
        ),
      },
      {
        id: Style.Style2,
        name: t("themes.red"),
        theme: <ThemeAdmin className={classNames(style.theme, style.red)} />,
        preview: (
          <ThemeMobile
            className={classNames(style.preview, style.previewRed)}
          />
        ),
        palette: themeColors.style2,
      },
      {
        id: Style.Style3,
        name: t("themes.blue"),
        theme: <ThemeAdmin className={classNames(style.theme, style.blue)} />,
        preview: (
          <ThemeMobile
            className={classNames(style.preview, style.previewBlue)}
          />
        ),
        palette: themeColors.style3,
      },
      {
        id: Style.Style4,
        name: t("themes.grey"),
        theme: <ThemeAdmin className={classNames(style.theme, style.grey)} />,
        preview: (
          <ThemeMobile
            className={classNames(style.preview, style.previewGrey)}
          />
        ),
        palette: themeColors.style4,
      },
      {
        id: Style.Style5,
        name: t("themes.green"),
        theme: <ThemeAdmin className={classNames(style.theme, style.green)} />,
        preview: (
          <ThemeMobile
            className={classNames(style.preview, style.previewGreen)}
          />
        ),
        palette: themeColors.style5,
      },
      {
        id: Style.Style6,
        name: t("themes.gold"),
        theme: <ThemeAdmin className={classNames(style.theme, style.gold)} />,
        preview: (
          <ThemeMobile
            className={classNames(style.preview, style.previewGold)}
          />
        ),
        palette: themeColors.style6,
      },
    ],
    [t]
  );

  const handleClickRight = useCallback(() => {
    const currentIndex = themeStyles.findIndex(
      (t) => t.id === currentPreview?.id
    );
    const nextIndex =
      currentIndex === themeStyles.length - 1 ? 0 : currentIndex + 1;
    const nextTheme = themeStyles[nextIndex];
    setCurrentPreview(nextTheme);
  }, [currentPreview?.id, themeStyles]);

  const handleClickLeft = useCallback(() => {
    const currentIndex = themeStyles.findIndex(
      (t) => t.id === currentPreview?.id
    );
    const previousIndex =
      currentIndex === 0 ? themeStyles.length - 1 : currentIndex - 1;
    const previousTheme = themeStyles[previousIndex];
    setCurrentPreview(previousTheme);
  }, [currentPreview?.id, themeStyles]);

  useEffect(() => {
    return () => {
      if (organization?.style) {
        setStyle(organization.style);
      }
    };
  }, [organization?.style, setStyle]);

  return {
    t,
    themeStyles,
    initialValues,
    handleSubmit,
    isLoading,
    currentPreview,
    setCurrentPreview,
    handleClickRight,
    handleClickLeft,
    handleOverlayClose,
  };
}
