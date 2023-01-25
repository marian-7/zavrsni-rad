import { destroyCookie, parseCookies, setCookie } from "nookies";
import { OrganizationPreferences } from "domain/types/Organization";
import { GetServerSidePropsContext } from "next";

export enum Cookies {
  Language = "language",
  Currency = "currency",
  NotificationMethod = "notificationMethod",
  Email = "bb_email",
  Location = "bb_location",
  Coordinates = "bb_coordinates",
  SelectedLocation = "bb_selected_location",
}

export function getCookie(name: string): string | undefined {
  const cookies = parseCookies();
  return cookies[name];
}

export function getCookieValueByOrganizationId(
  organizationId: number,
  name: Cookies,
  ctx?: GetServerSidePropsContext
) {
  const cookies = parseCookies(ctx);
  if (cookies[name]) {
    const required = JSON.parse(cookies[name]);
    if (required && Array.isArray(required)) {
      const value = required.find((value: { id: number; value: string }) => {
        return value.id === organizationId;
      });
      return value?.[name];
    }
  }
}

export function storePreferences(id: number, name: Cookies, value: string) {
  let organizations: OrganizationPreferences[] = [];
  const cookiesData = getCookie(name);
  if (cookiesData) {
    organizations = JSON.parse(cookiesData);
    const org = organizations.find((organization) => organization.id === id);
    if (organizations.length > 10 && !org) {
      organizations.shift();
      organizations.push({ id, [name]: value });
    } else if (organizations.length < 10 && !org) {
      organizations.push({ id, [name]: value });
    } else {
      const org = organizations.findIndex((organization) => organization.id === id);
      organizations[org] = { id, [name]: value };
    }
  } else {
    organizations.push({ id, [name]: value });
  }
  setCookieByName(name, JSON.stringify(organizations));
}

export function setCookieByName(name: string, value: any) {
  setCookie(null, name, value, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
}

export function deleteCookie(name: string) {
  destroyCookie({}, name, {
    path: "/",
  });
}
