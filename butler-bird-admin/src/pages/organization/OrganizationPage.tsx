import React, {
  createContext,
  FC,
  memo,
  Suspense,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Header } from "components/Header";
import { Sidebar } from "components/Sidebar";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { CustomRoute } from "components/CustomRoute";
import { paths, withSlug } from "paths";
import {
  MenusPage,
  CategoriesPage,
  ItemsPage,
  VenuesPage,
  LocationsPage,
  SettingsPage,
  OrdersPage,
  DashboardPage,
  PrintersPage,
} from "pages";
import { apiService } from "domain/services/apiService";
import { Mode, Organization, Status } from "domain/models/Organization";
import { useOrganizationQuery } from "hooks/useOrganizationQuery";
import { UserContext } from "providers/UserProvider";
import { useTheme } from "hooks/useTheme";
import { OrdersTicketingPage } from "pages/ordersTicketing/OrdersTicketingPage";
import { useOrderStatuses } from "hooks/useOrderStatuses";

export const OrganizationContext = createContext<Organization | undefined>(
  undefined
);

interface Props {}

export const OrganizationPage: FC<Props> = memo(function OrganizationPage() {
  const {
    organization,
    user,
    isStaffMember,
    match,
    orderStatuses,
    initialRoute,
  } = useOrganizationPage();

  return (
    <OrganizationContext.Provider value={organization}>
      {organization && orderStatuses && user && (
        <>
          <Header />
          {match?.url !== withSlug(paths.ordersTicketing()) && (
            <Sidebar
              isStaffMember={isStaffMember}
              organizationStatus={organization.status}
              mode={organization.mode}
            />
          )}
          <Suspense fallback={null}>
            <Switch>
              <Route exact path={withSlug("", true)}>
                <Redirect to={initialRoute} />
              </Route>
              {organization.status === Status.Premium && !isStaffMember && (
                <CustomRoute
                  type="protected"
                  path={withSlug(paths.dashboard(), true)}
                >
                  <DashboardPage />
                </CustomRoute>
              )}
              {organization.mode !== Mode.View && (
                <CustomRoute path={withSlug(paths.ordersTicketing(), true)}>
                  <OrdersTicketingPage />
                </CustomRoute>
              )}
              {organization.mode !== Mode.View && (
                <CustomRoute
                  type="protected"
                  path={withSlug(paths.orders(), true)}
                >
                  <OrdersPage />
                </CustomRoute>
              )}
              {!isStaffMember && (
                <CustomRoute type="protected" path={paths.menus()}>
                  <MenusPage />
                </CustomRoute>
              )}
              {!isStaffMember && (
                <CustomRoute type="protected" path={paths.categories()}>
                  <CategoriesPage />
                </CustomRoute>
              )}
              {!isStaffMember && (
                <CustomRoute
                  type="protected"
                  path={withSlug(paths.items(), true)}
                >
                  <ItemsPage />
                </CustomRoute>
              )}
              {!isStaffMember && (
                <CustomRoute
                  type="protected"
                  path={withSlug(paths.venues(), true)}
                >
                  <VenuesPage />
                </CustomRoute>
              )}
              {!isStaffMember && (
                <CustomRoute
                  type="protected"
                  path={withSlug(paths.locations(), true)}
                >
                  <LocationsPage />
                </CustomRoute>
              )}
              {!isStaffMember && (
                <CustomRoute
                  type="protected"
                  path={withSlug(paths.settings(), true)}
                >
                  <SettingsPage />
                </CustomRoute>
              )}
              {!isStaffMember && (
                <CustomRoute
                  type="protected"
                  path={withSlug(paths.printers(), true)}
                >
                  <PrintersPage />
                </CustomRoute>
              )}
              <Redirect to={withSlug("/")} />
            </Switch>
          </Suspense>
        </>
      )}
    </OrganizationContext.Provider>
  );
});

function useOrganizationPage() {
  const { data: organization } = useOrganizationQuery();
  const { data: orderStatuses } = useOrderStatuses();
  const { setStyle } = useTheme();
  const { user } = useContext(UserContext);
  const { id } = organization ?? {};
  const match = useRouteMatch(withSlug(paths.ordersTicketing()));

  const isStaffMember =
    organization?.staff.some((member) => member.email === user?.email) ?? false;

  const initialRoute = useMemo(() => {
    if (organization?.status === Status.Premium && !isStaffMember) {
      return withSlug(paths.dashboard());
    }
    if (organization?.mode !== Mode.View) {
      return withSlug(paths.orders());
    }
    if (!isStaffMember) {
      return withSlug(paths.menus());
    }
    return withSlug("");
  }, [isStaffMember, organization?.mode, organization?.status]);

  useEffect(() => {
    if (id) {
      apiService.defaults.headers.organization = id;
      return () => {
        delete apiService.defaults.headers.organization;
      };
    }
  }, [id, setStyle]);

  return {
    organization,
    user,
    isStaffMember,
    match,
    initialRoute,
    orderStatuses,
  };
}
