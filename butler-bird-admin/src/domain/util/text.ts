import { i18n } from "assets/strings/i18n";
import { Typography } from "domain/models/Typography";

export function getLabel(
  text: Typography,
  local: string[] | string,
  fallback?: string
) {
  const key = Array.isArray(local) ? local[0] : local;
  if (key && text[key]) {
    return text[key];
  }
  if (fallback !== undefined) {
    return fallback;
  }
  return i18n.t("other.unknown");
}
