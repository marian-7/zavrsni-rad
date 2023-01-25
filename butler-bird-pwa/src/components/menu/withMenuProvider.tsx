import React, { FC } from "react";
import { MenuProvider } from "providers/MenuProvider";
import { CurrencyProvider } from "providers/CurrencyProvider";

export function withMenuProvider<T>(Page: FC<T>) {
  return (props: T) => (
    <MenuProvider>
      <CurrencyProvider>
        <Page {...props} />
      </CurrencyProvider>
    </MenuProvider>
  );
}
