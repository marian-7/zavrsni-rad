import { Card } from "./Card";
import { Typography } from "domain/models/Typography";
import { Image } from "domain/models/Image";

export enum Status {
  Standard = "standard",
  Premium = "premium",
}

export enum Mode {
  View = "view",
  Order = "order",
  Payment = "payment",
}

interface Cover {
  id: string;
  name: string;
  width: number;
  height: number;
  url: string;
}

interface OrderType {
  id: number;
  name: Typography;
}

export interface OrderStatus {
  id: number;
  notifySender: boolean;
  notifyRecipient: boolean;
  marksOrderComplete: boolean;
  name: Typography;
}

export interface Staff {
  id?: number;
  email: string;
}

export enum Style {
  Style1 = "style1",
  Style2 = "style2",
  Style3 = "style3",
  Style4 = "style4",
  Style5 = "style5",
  Style6 = "style6",
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  published_at: Date;
  status: Status;
  style: Style;
  currency: string;
  created_at: Date;
  updated_at: Date;
  category: string;
  carousel: Card[];
  logo: Image;
  cover: Cover;
  languages: string[];
  orderTypes: OrderType[];
  orderStatuses: OrderStatus[];
  initialOrderStatus: OrderStatus;
  message?: Typography;
  staff: Staff[];
  mode: Mode;
}
