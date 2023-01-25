import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { Cookies, getCookieValueByOrganizationId } from "domain/util/cookies";
import { useTable } from "hooks/useTable";
import { CurrencyContext } from "context/CurrencyContext";

type Props = {};

export const CurrencyProvider: FC<Props> = memo(function CurrencyProvider({ children }) {
  const { currency, coefficient, handleCurrencyChange } = useCurrencyProvider();

  return (
    <CurrencyContext.Provider
      value={{ currency, coefficient, onCurrencyChange: handleCurrencyChange }}
    >
      {children}
    </CurrencyContext.Provider>
  );
});

function useCurrencyProvider() {
  const [currency, setCurrency] = useState("");
  const [coefficient, setCoefficient] = useState(1);

  const { organizationId, currencies, defaultCurrency } = useTable();

  const handleCurrencyChange = useCallback(
    (currency: string) => {
      if (currencies) {
        setCurrency(currency);
        setCoefficient(currencies[currency]);
      }
    },
    [currencies]
  );

  useEffect(() => {
    if (organizationId && currencies && defaultCurrency) {
      const selectedOrganizationCurrency: string | undefined = getCookieValueByOrganizationId(
        organizationId,
        Cookies.Currency
      );
      if (selectedOrganizationCurrency) {
        setCurrency(selectedOrganizationCurrency);
        setCoefficient(currencies[selectedOrganizationCurrency]);
      } else {
        setCurrency(defaultCurrency);
        setCoefficient(currencies[defaultCurrency]);
      }
    }
  }, [currencies, currency, defaultCurrency, organizationId]);

  return { coefficient, currency, handleCurrencyChange };
}
