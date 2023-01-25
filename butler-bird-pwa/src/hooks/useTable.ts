import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getTableById } from "domain/services/tableService";
import { useTheme } from "context/ThemeContext";

export function useTable() {
  const queryClient = useQueryClient();
  const { query } = useRouter();
  const { setStyle } = useTheme();

  const tableId = useMemo(() => {
    if (typeof query.id === "string") {
      return query.id;
    }
  }, [query.id]);

  const { data } = useQuery(
    ["table", tableId],
    ({ queryKey }) => {
      const [, id] = queryKey;
      if (id) {
        return queryClient.getQueryData(queryKey) ?? getTableById(id).then((res) => res.data);
      }
    },
    { enabled: !!tableId }
  );

  const organizationId = useMemo(() => {
    return data?.organization;
  }, [data]);

  const logo = useMemo(() => {
    return data?.logo?.url;
  }, [data?.logo?.url]);

  const currencies = useMemo(() => {
    return data?.currencies;
  }, [data?.currencies]);

  const listOfCurrencies = useMemo(() => {
    if (currencies) {
      return Object.keys(currencies);
    }
  }, [currencies]);

  const defaultCurrency = useMemo(() => data?.currency, [data?.currency]);

  const bannerMessage = useMemo(() => data?.venue.bannerMessage, [data?.venue.bannerMessage]);

  useEffect(() => {
    if (data) {
      setStyle(data.style);
    }
  }, [data, setStyle]);

  return {
    table: data,
    currencies,
    listOfCurrencies,
    logo,
    organizationId,
    defaultCurrency,
    bannerMessage,
  };
}
