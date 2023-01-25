import { Page } from "components/Page";
import React, { FC, memo } from "react";
import { List } from "components/List";
import { useTranslation } from "react-i18next";
import { SettingsListItem } from "pages/settings/components/SettingsListItem";
import { paths, withSlug } from "paths";
import { CustomRoute } from "components/CustomRoute";
import { SettingsOrganizationPage } from "pages/settingsOrganization/SettingsOrganizationPage";
import { Redirect, Route, Switch } from "react-router-dom";
import { SettingsCurrencyPage } from "pages/settingsCurrency/SettingsCurrencyPage";
import { SettingsStaffPage } from "pages/settingsStaff/SettingsStaffPage";
import { SettingsThemesPage } from "pages/settingsThemes/SettingsThemesPage";

interface Props {}

const SettingsPage: FC<Props> = memo(function SettingsPage() {
  useSettingsPage();
  const { t } = useTranslation();

  return (
    <Page>
      <List title={t("pages.settings.title")}>
        <SettingsListItem
          title={t("pages.settings.list.organization.title")}
          label={t("pages.settings.list.organization.label")}
          path={withSlug(paths.settingsOrganization())}
        />
        <SettingsListItem
          title={t("pages.settings.list.themes.title")}
          label={t("pages.settings.list.themes.label")}
          path={withSlug(paths.settingsThemes())}
        />
        <SettingsListItem
          title={t("pages.settings.list.currency.title")}
          label={t("pages.settings.list.currency.label")}
          path={withSlug(paths.settingsCurrency())}
        />
        <SettingsListItem
          title={t("pages.settings.list.staff.title")}
          label={t("pages.settings.list.staff.label")}
          path={withSlug(paths.settingsStaff())}
        />
      </List>
      <Switch>
        <Route path={withSlug(paths.settings(), true)} exact>
          <Redirect to={withSlug(paths.settingsOrganization())} />
        </Route>
        <CustomRoute path={withSlug(paths.settingsOrganization())}>
          <SettingsOrganizationPage />
        </CustomRoute>
        <CustomRoute path={withSlug(paths.settingsCurrency())}>
          <SettingsCurrencyPage />
        </CustomRoute>
        <CustomRoute path={withSlug(paths.settingsStaff())}>
          <SettingsStaffPage />
        </CustomRoute>
        <CustomRoute path={withSlug(paths.settingsThemes())}>
          <SettingsThemesPage />
        </CustomRoute>
      </Switch>
    </Page>
  );
});

function useSettingsPage() {}

export default SettingsPage;
