import React, { FC, memo, useContext } from "react";
import { RouteProps, Route, Redirect } from "react-router-dom";
import { paths, withSlug } from "paths";
import { UserContext } from "providers/UserProvider";
import * as H from "history";

type Props = RouteProps & {
  type?: "protected" | "public";
};

export const CustomRoute: FC<Props> = memo(function CustomRoute({
  children,
  type,
  ...rest
}) {
  const { isAuthenticated } = useCustomRoute();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (type === "protected" && !isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: withSlug(paths.login()),
                state: { from: location },
              }}
            />
          );
        }
        if (type === "public" && isAuthenticated) {
          const state = location.state as
            | { from: H.LocationDescriptor }
            | undefined;
          return <Redirect to={state?.from ?? { pathname: withSlug("/") }} />;
        }
        return children;
      }}
    />
  );
});

function useCustomRoute() {
  const { isAuthenticated } = useContext(UserContext);

  return { isAuthenticated };
}
