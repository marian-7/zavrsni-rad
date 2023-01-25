export const paths = {
  root: () => "/",
  qr: () => "/qr",
  qrInfo: () => "/qr-info",
  login: () => `login`,
  loginOnTable: (id: string | number = "id") => `/tables/${id}/login`,
  tables: (id: string | number = ":id") => `/tables/${id}`,
  success: (id: string | number = ":id") => `/tables/${id}/success`,
  menus: (id: string | number = ":id", menuId: string | number = ":menuId") =>
    `/tables/${id}/menus/${menuId}`,
  orderPreview: (id: string | number = ":id") => `/tables/${id}/order-preview`,
  appFeedback: (id: string | number = ":id") => `/tables/${id}/feedback/app`,
  organizationFeedback: (id: string | number = ":id", menuId: string | number = ":menuId") =>
    `/tables/${id}/menus/${menuId}/feedback/organization`,
  emailNotifications: (id: string | number = ":id") => `/tables/${id}/email-notifications`,
  deleteProfile: () => `/delete`,
  address: (id: string | number = ":id") => `/tables/${id}/location/address`,
  map: (id: string | number = ":id") => `/tables/${id}/location/map`,
  confirmAddress: (id: string | number = ":id") => `/tables/${id}/location/confirm`,
  finish: (id: string | number = ":id") => `/tables/${id}/location/finish`,
  addressDetails: (id: string | number = ":id") => `/tables/${id}/location/details`,
  locationsList: (id: string | number = ":id") => `/tables/${id}/location/locations-list`,
};
