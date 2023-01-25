import { useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useTable } from "hooks/useTable";

export function useBanner() {
  const key = "bannerMessage";

  const { bannerMessage } = useTable();

  const queryClient = useQueryClient();
  const { data: showBanner = true } = useQuery(key, () => queryClient.getQueryData<boolean>(key), {
    enabled: !!bannerMessage,
  });

  const closeBanner = useCallback(() => {
    queryClient.setQueryData(key, false);
  }, [key, queryClient]);

  return { showBanner, closeBanner };
}
