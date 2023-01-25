import { ChangeEvent, createContext } from "react";
import { Category } from "domain/types/Category";
import { Tag } from "domain/types/Tag";
import { Item } from "domain/types/Item";

type MenuContextType = {
  categoriesList?: Category[];
  selectedCategory?: number;
  onSelectedCategory: (id: number) => void;
  filter: number[];
  search?: string;
  onShowModal: () => void;
  onSearch: (e: ChangeEvent<{ value: string }>) => void;
  onFilter: (values: number[]) => void;
  modalType?: string | string[];
  tags?: Tag[];
  onItemClick: (item: Item) => void;
  item?: Item;
  onClose: () => void;
  path?: string;
  bannerMessage?: Record<string, string>;
};

export const MenuContext = createContext<MenuContextType>({} as MenuContextType);
