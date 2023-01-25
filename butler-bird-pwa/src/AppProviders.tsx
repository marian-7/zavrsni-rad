import React, { FC, memo } from "react";
import { ThemeProvider } from "providers/ThemeProvider";
import { Provider } from "next-auth/client";
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { AuthProvider } from "providers/AuthProvider";

type Props = {
  session: Session;
  pageProps: any;
};

const client = new QueryClient();

export const AppProviders: FC<Props> = memo(function AppProviders({
  children,
  session,
  pageProps,
}) {
  return (
    <Provider session={session}>
      <AuthProvider>
        <QueryClientProvider client={client}>
          <Hydrate state={pageProps.dehydratedState}>
            <ThemeProvider>{children}</ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
  );
});

function useAppProviders() {}
