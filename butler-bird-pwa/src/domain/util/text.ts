import { Typography } from "domain/types/Typography";
import { i18n } from "next-i18next";

export function getLabel(text: Typography, local: string[] | string) {
  const key = Array.isArray(local) ? local[0] : local;
  if (key) {
    return text[key] ?? i18n?.t("other.unknown");
  }
  return i18n?.t("other.unknown");
}
