export function getFormattedPrice(
  price: number,
  locale: string,
  currency: string
) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(price);
}
