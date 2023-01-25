import React, { FC } from "react";
import { CurrencyProvider } from "providers/CurrencyProvider";

export function withCurrencyProvider<T>(Page: FC<T>) {
  return (props: T) => (
    <CurrencyProvider>
      <Page {...props} />
    </CurrencyProvider>
  );
}
