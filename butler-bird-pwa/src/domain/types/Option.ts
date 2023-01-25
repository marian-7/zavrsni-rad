export type Option = {
  id: number;
  createdAt: string;
  name: Record<string, string>;
  updatedAt: string;
  price: number;
  amount?: number;
  description?: Record<string, string>;
};
