import { Image } from "domain/types/Image";
import { OptionGroup } from "domain/types/OptionGroup";

export type Item = {
  id: number;
  tags: number[];
  categories: number[];
  createdAt: string;
  updatedAt: string;
  description: Record<string, string>;
  image?: Image;
  name: Record<string, string>;
  price: number;
  optionGroups?: OptionGroup[];
  longDescription?: Record<string, string>;
};
