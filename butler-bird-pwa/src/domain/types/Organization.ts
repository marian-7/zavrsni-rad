export type OrganizationPreferences = {
  [x: string]: string | number;
  id: number;
};

export enum OrganizationMode {
  View = "view",
  Order = "order",
  Payment = "payment",
}
