export type Installation = {
  id: number;
  pushToken: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  email?: string | null;
  izooto?: string | null;
  phoneNumber: string | null;
  preferredNotificationMethod: string | null;
  uid: string;
  pushNotificationToken: string | null;
};
