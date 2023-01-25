export type OrderType = {
  id: number;
  organization: number;
  name: Record<string, string>;
  publishedAt: Date;
  updatedAt: Date;
  createdAt: Date;
};
