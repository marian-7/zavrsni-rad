import { Typography } from "domain/models/Typography";

export interface Table {
  id: number;
  label: string;
  venue?: number;
}

export interface Venue {
  id: number;
  name: Typography;
  menus: number[];
  tables: Table[];
  bannerMessage?: Typography;
  location: number;
  takeout?: boolean;
}
