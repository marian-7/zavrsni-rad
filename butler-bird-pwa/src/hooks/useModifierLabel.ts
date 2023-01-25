import { useRouter } from "next/router";
import { useCurrency } from "hooks/useCurrency";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { getFormattedPrice } from "domain/util/price";

export function useModifierLabel(price: number) {
  const { locale } = useRouter();
  const { currency, coefficient } = useCurrency();
  const { t } = useTranslation("menu");

  return useMemo(() => {
    if (price > 0) {
      return t("positiveModifier", {
        price: getFormattedPrice(price, locale!, currency, coefficient),
      });
    } else if (price < 0) {
      return t("negativeModifier", {
        price: getFormattedPrice(Math.abs(price), locale!, currency, coefficient),
      });
    } else {
      return null;
    }
  }, [coefficient, currency, locale, price, t]);
}
