import { Typography } from "domain/models/Typography";

interface Option {
  id: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  name: Typography;
  publishedAt: Date;
  amount?: number;
}

export interface OptionGroup {
  id: number;
  selectionMode: string;
  required: boolean;
  name: Typography;
  description: Typography;
  options: Option[];
}

export interface ItemsSnapshot {
  id: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  name: Typography;
  description: Typography;
  optionGroups: OptionGroup[];
  publishedAt: Date;
  amount: number;
}

interface Pin {
  id: number;
  latitude: number;
  longitude: number;
}

interface LocationSnapshot {
  id: number;
  address: string;
  organization: number;
  createdAt: Date;
  updatedAt: Date;
  name: Typography;
  pins: Pin[];
  publishedAt: Date;
}

interface Currency {
  id: number;
  iso: string;
  published_at: Date;
  updatedAt: Date;
  createdAt: Date;
  created_at?: any;
  updated_at?: any;
}

interface Organization {
  id: number;
  name: string;
  slug: string;
  published_at: Date;
  status: string;
  style: string;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
  created_at?: any;
  updated_at?: any;
  category: number;
  initialOrderStatus: number;
}

interface TableSnapshot {
  id: number;
  label: string;
  organization: Organization;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

interface VenueSnapshot {
  id: number;
  location: number;
  organization: number;
  createdAt: Date;
  updatedAt: Date;
  name: Typography;
  publishedAt: Date;
}

interface InstallationSnapshot {
  id: number;
  pushToken: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

interface CategoriesSnapshot {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: Typography;
  description: Typography;
  publishedAt: Date;
}

export interface Order {
  id: number;
  type?: number;
  table: number;
  organization: number;
  location: number;
  venue: number;
  amount?: number;
  currency: number;
  itemsSnapshot: ItemsSnapshot[];
  locationSnapshot: LocationSnapshot;
  tableSnapshot: TableSnapshot;
  venueSnapshot: VenueSnapshot;
  currencySnapshot: string;
  status: number;
  installation: number;
  installationSnapshot: InstallationSnapshot;
  categoriesSnapshot: CategoriesSnapshot[];
  note: string;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date;
  canceledReason: string;
}
