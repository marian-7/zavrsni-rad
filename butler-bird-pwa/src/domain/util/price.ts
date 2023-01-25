import { Item } from "domain/types/Item";
import { ItemsSnapshot, LocalOrder } from "domain/types/OrderHistory";
import { i18n } from "next-i18next";

export const getFormattedPrice = (
  price: number,
  locale: string,
  currency: string | undefined,
  coeficcient: number
) => {
  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(price * coeficcient);
  }
  return i18n!.t("other.unknown");
};

export function getItemPrice(orderItem: Item | ItemsSnapshot, quantity: number) {
  const priceOfOptions = orderItem.optionGroups?.reduce((sum, group) => {
    const total = group.options.reduce((res, option) => {
      if (option.amount) {
        return res + option.price * option.amount;
      }
      return res + option.price;
    }, 0);

    return total + sum;
  }, 0);

  const price = orderItem.price + (priceOfOptions ?? 0);

  return price * quantity;
}

export function getOrderPrice(order: LocalOrder) {
  return order.items?.reduce((sum, orderItem) => {
    return sum + getItemPrice(orderItem.item, orderItem.quantity);
  }, 0);
}
