import { Item } from "domain/types/Item";
import { OptionGroup } from "domain/types/OptionGroup";

export type LocalOrderItem = {
  id: string;
  item: Item;
  quantity: number;
  price: number;
  menuId: number;
};

export type LocalOrder = {
  items: LocalOrderItem[];
};

export type OrderItem = {
  id: number;
  amount: number;
  optionGroups: OptionGroup[];
};
