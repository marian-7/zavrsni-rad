import { Image } from "domain/types/Image";

export type Menu = {
  createdAt: string;
  description: Record<string, string>;
  id: number;
  name: Record<string, string>;
  updatedAt: string;
  image?: Image;
};
