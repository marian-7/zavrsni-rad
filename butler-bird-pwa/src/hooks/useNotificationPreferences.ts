import { useCallback, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Cookies, getCookie } from "domain/util/cookies";
import { NotificationPreference } from "components/notification/OrderNotificationDialog";

export function useNotificationPreferences() {
  const { current: key } = useRef("notificationMethod");

  const queryClient = useQueryClient();
  const { data: cachedPreference } = useQuery(key, () =>
    queryClient.getQueryData<NotificationPreference>(key)
  );

  const setPreferences = useCallback(
    (method: string) => {
      queryClient.setQueryData(key, method);
    },
    [key, queryClient]
  );

  const notificationPreference = useMemo(() => {
    const preferencesFromCookies = getCookie(Cookies.NotificationMethod) as
      | NotificationPreference
      | undefined;
    return preferencesFromCookies ?? cachedPreference;
  }, [cachedPreference]);

  const clearPreference = useCallback(() => {
    queryClient.setQueryData(key, undefined);
  }, [key, queryClient]);

  return { notificationPreference, setPreferences, cachedPreference, clearPreference };
}
