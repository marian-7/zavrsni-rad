import { Menu } from "domain/models/Menu";

export function getFormattedTime(menu: Menu) {
  const { activeTimeStart, activeTimeEnd } = menu;
  const start = activeTimeStart?.split(":").slice(0, 2).join(":");
  const end = activeTimeEnd?.split(":").slice(0, 2).join(":");

  return `${start} - ${end}`;
}
