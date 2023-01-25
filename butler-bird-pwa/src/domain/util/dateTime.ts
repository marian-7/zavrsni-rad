import { i18n } from "next-i18next";
import dayjs from "dayjs";

export const timeFormat = "HH:mm";
export const dateFormat = "DD.MM.YYYY";

export function getFormattedDate(timestamp: Date, locale: string) {
  return dayjs(timestamp).locale(locale).format(dateFormat);
}

export function getFormattedTime(timestamp: Date, locale: string) {
  return dayjs(timestamp).locale(locale).format(timeFormat);
}

export function getOrderDateTime(timestamp: Date, locale: string) {
  return i18n!.t("dateTime.orderDate", {
    date: getFormattedDate(timestamp, locale),
    time: getFormattedTime(timestamp, locale),
  });
}
