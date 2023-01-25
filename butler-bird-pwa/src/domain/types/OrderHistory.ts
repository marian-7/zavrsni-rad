import { Item } from "domain/types/Item";
import { OptionGroup } from "domain/types/OptionGroup";

export type LocalOrderItem = {
  id: string;
  item: Item;
  quantity: number;
  price: number;
};

export type LocalOrder = {
  items: LocalOrderItem[];
};

export interface Pin {
  id: number;
  latitude: number;
  longitude: number;
}

export interface LocationSnapshot {
  id: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  name: Record<string, string>;
  pins: Pin[];
  publishedAt: Date;
}

export interface TableSnapshot {
  id: number;
  label: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface VenueSnapshot {
  id: number;
  location: number;
  createdAt: Date;
  updatedAt: Date;
  name: Record<string, string>;
  publishedAt: Date;
}

export interface InstallationSnapshot {
  id: number;
  pushToken: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface CategoriesSnapshot {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: Record<string, string>;
  description: Record<string, string>;
  publishedAt: Date;
}

export interface ItemsSnapshot {
  id: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  name: Record<string, string>;
  description: Record<string, string>;
  optionGroups: OptionGroup[];
  publishedAt: Date;
  amount?: number;
}

export interface OrderHistory {
  id: number;
  type: number;
  table: number;
  organization: number;
  location: number;
  venue: number;
  amount?: number;
  currency: string;
  itemsSnapshot?: ItemsSnapshot[] | null;
  locationSnapshot: LocationSnapshot;
  tableSnapshot: TableSnapshot;
  venueSnapshot: VenueSnapshot;
  currencySnapshot: string;
  status: number;
  installation: number;
  installationSnapshot: InstallationSnapshot;
  categoriesSnapshot?: CategoriesSnapshot | null;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  canceledAt?: Date;
  canceledReason?: Date;
}
