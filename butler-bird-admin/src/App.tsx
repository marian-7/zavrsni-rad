import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider } from "providers/QueryClientProvider";
import { I18nextProvider } from "providers/I18nextProvider";
import { CustomRoute } from "components/CustomRoute";
import { paths, withSlug } from "paths";
import { UserProvider } from "providers/UserProvider";
import { ThemeProvider } from "providers/ThemeProvider";
import { StylesProvider } from "@material-ui/core";
import {
  ForgotPasswordPage,
  LoginPage,
  RegistrationPage,
  ResetPasswordPage,
} from "pages";
import { OrganizationPage } from "pages/organization/OrganizationPage";
import { SnackbarProvider } from "providers/SnackbarProvider";
import isToday from "dayjs/plugin/isToday";
import dayjs from "dayjs";

dayjs.extend(isToday);

function App() {
  return (
    <StylesProvider injectFirst>
      <QueryClientProvider>
        <Router>
          <I18nextProvider>
            <ThemeProvider>
              <UserProvider>
                <SnackbarProvider>
                  <Suspense fallback={null}>
                    <Switch>
                      <CustomRoute
                        type="public"
                        path={withSlug(paths.registration(), true)}
                      >
                        <RegistrationPage />
                      </CustomRoute>
                      <CustomRoute
                        exact
                        path={withSlug(paths.login(), true)}
                        type="public"
                      >
                        <LoginPage />
                      </CustomRoute>
                      <CustomRoute
                        exact
                        path={paths.forgotPassword()}
                        type="public"
                      >
                        <ForgotPasswordPage />
                      </CustomRoute>
                      <CustomRoute
                        exact
                        path={paths.resetPassword()}
                        type="public"
                      >
                        <ResetPasswordPage />
                      </CustomRoute>
                      <CustomRoute type="protected" path={paths.organization()}>
                        <OrganizationPage />
                      </CustomRoute>
                    </Switch>
                  </Suspense>
                </SnackbarProvider>
              </UserProvider>
            </ThemeProvider>
          </I18nextProvider>
        </Router>
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </StylesProvider>
  );
}

export default App;
