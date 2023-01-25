import { useLocation } from "react-router-dom";
import queryString, { ParsedQuery } from "query-string";

export function useQueryString(): ParsedQuery {
  const { search } = useLocation();

  return queryString.parse(search);
}
