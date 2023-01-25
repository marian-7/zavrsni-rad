import { FC, memo, useState } from "react";
import { QueryClient, QueryClientProvider as QueryProvider } from "react-query";
import { get } from "lodash";
import { Snackbar } from "components/Snackbar";

type Props = {};

export const QueryClientProvider: FC<Props> = memo(
  function QueryClientProvider({ children }) {
    const { queryClient } = useQueryClientProvider();

    return <QueryProvider client={queryClient}>{children}</QueryProvider>;
  }
);

function useQueryClientProvider() {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
        mutations: {
          onError: (error) => {
            const msg = get(
              error,
              "response.data.message[0].messages[0].message"
            );
            if (msg) {
              Snackbar.show(msg);
            } else if (error instanceof Error) {
              Snackbar.show(error.message);
            }
          },
        },
      },
    })
  );

  return { queryClient };
}
