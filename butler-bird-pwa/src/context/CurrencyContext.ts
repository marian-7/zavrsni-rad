import { createContext } from "react";

export type CurrencyContextType = {
  currency: string;
  coefficient: number;
  onCurrencyChange: (currency: string) => void;
};

export const CurrencyContext = createContext<CurrencyContextType>({} as CurrencyContextType);
