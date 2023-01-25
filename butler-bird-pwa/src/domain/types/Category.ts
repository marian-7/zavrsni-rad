import { Item } from "domain/types/Item";
import { Image } from "domain/types/Image";

export type Category = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: Record<string, string>;
  description: Record<string, string>;
  items: Item[];
  image?: Image;
};
