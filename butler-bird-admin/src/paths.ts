import { matchPath } from "react-router-dom";

export function slugPath(url: string, slug = ":slug") {
  return `/${slug}${url}`;
}

export function withSlug(url: string, template = false) {
  const pathname = window.location.pathname;
  let slug: string | undefined = ":slug";
  if (!template) {
    const path = matchPath<{ slug: string }>(pathname, `/${slug}`);
    slug = path?.params.slug;
  }
  return slug ? `/${slug}${url}` : url;
}

export const paths = {
  organization: (slug?: string) => slugPath("", slug),
  dashboard: () => "/dashboard",
  orders: () => "/orders",
  ordersTicketing: () => "/orders/ticketing",
  order: (order: number | string = ":order") => `/orders/${order}`,
  menus: (slug?: string) => slugPath("/menus", slug),
  menuCreate: (slug?: string) => slugPath("/menus/create", slug),
  menu: (menu: number | string = ":menu", slug?: string) =>
    slugPath(`/menus/${menu}`, slug),
  categories: (slug?: string) => slugPath("/categories", slug),
  category: (id: number | string = ":id", slug?: string) =>
    slugPath(`/categories/${id}`, slug),
  categoryCreate: (slug?: string) => slugPath("/categories/create", slug),
  items: () => "/items",
  item: (item: string | number = ":item", rest: string = "") =>
    `/items/${item}${rest}`,
  itemCreate: (rest: string = "") => `/items/create${rest}`,
  tags: () => `/tags`,
  tag: (tag: string | number = ":tag") => `/tags/${tag}`,
  modifiers: () => "/modifiers",
  modifierCreate: (rest: string = "") => `/modifiers/create${rest}`,
  modifier: (modifier: number | string = ":modifier", rest: string = "") =>
    `/modifiers/${modifier}${rest}`,
  modifierOptions: () => `/options`,
  modifierOption: (option: number | string = ":option") => `/options/${option}`,
  locations: () => "/locations",
  location: (location: number | string = ":location") =>
    `/locations/${location}`,
  locationCreate: () => "/locations/create",
  settings: () => "/settings",
  settingsOrganization: () => "/settings/organization",
  settingsThemes: () => "/settings/themes",
  settingsCurrency: () => "/settings/currency",
  settingsStaff: () => "/settings/staff",
  login: () => "/login",
  forgotPassword: (slug?: string) => slugPath("/forgot-password", slug),
  resetPassword: (slug?: string) => slugPath("/reset-password", slug),
  itemsPicker: (id: number | string = ":id", slug?: string) =>
    slugPath(`/categories/${id}/items`, slug),
  createItemsPicker: (slug?: string) =>
    slugPath("/categories/create/items", slug),
  categoriesPicker: (menu: number | string = ":menu", slug?: string) =>
    slugPath(`/menus/${menu}/categories`, slug),
  createCategoriesPicker: (slug?: string) =>
    slugPath("/menus/create/categories", slug),
  createCategoryItems: (
    category: string | number = ":category",
    slug?: string
  ) => slugPath(`/menus/create/categories/${category}/items`, slug),
  categoryItems: (
    menu: string | number = ":menu",
    category: string | number = ":category",
    slug?: string
  ) => slugPath(`/menus/${menu}/categories/${category}/items`, slug),
  venues: () => "/venues",
  venue: (venue: number | string = ":venue") => `/venues/${venue}`,
  venueCreate: () => `/venues/create`,
  tables: (venue: string | number = ":venue") => `/venues/${venue}/tables`,
  venuesCreateTables: () => `/venues/create/tables`,
  venueLocationPicker: (venue: number | string = ":venue") =>
    `/venues/${venue}/locations`,
  venueCreateLocationPicker: () => `/venues/create/locations`,
  venueMenusPicker: (venue: number | string = ":venue") =>
    `/venues/${venue}/menus`,
  venueCreateMenusPicker: () => `/venues/create/menus`,
  venueTablesAdd: (venue: string | number = ":venue") =>
    `/venues/${venue}/tables/create`,
  venueCreateTablesAdd: () => "/venues/create/tables/create",
  venueCategories: (
    venue: string | number = ":venue",
    menu: string | number = ":menu"
  ) => `/venues/${venue}/menus/${menu}/categories`,
  venueCreateCategories: (menu: string | number = ":menu") =>
    `/venues/create/menus/${menu}/categories`,
  registration: (invitation = ":invitation") => `/invitation/${invitation}`,
  settingsStaffInvite: () => "/settings/staff/invite",
  printers: () => "/printers",
  printerCreate: () => "/printers/create",
  printer: (printer: string | number = ":printer") => `/printers/${printer}`,
};
