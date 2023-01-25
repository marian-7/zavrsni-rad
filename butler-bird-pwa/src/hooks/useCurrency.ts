import { useContext } from "react";
import { CurrencyContext } from "context/CurrencyContext";

export function useCurrency() {
  return useContext(CurrencyContext);
}
