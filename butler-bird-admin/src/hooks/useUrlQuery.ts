import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { parse } from "query-string";

export function useUrlQuery() {
  const { search } = useLocation();

  return useMemo(() => {
    return parse(search, {
      parseBooleans: true,
      parseNumbers: true,
      decode: false,
    });
  }, [search]);
}
