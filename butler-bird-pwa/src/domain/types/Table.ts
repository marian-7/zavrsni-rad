import { Menu } from "domain/types/Menu";
import { Image } from "domain/types/Image";
import { OrderType } from "domain/types/OrderType";
import { Style } from "providers/ThemeProvider";
import { OrganizationMode } from "domain/types/Organization";
import { Venue } from "domain/types/Venue";

export type Table = {
  currencies: Record<string, number>;
  currency: string;
  customOrderTypes: OrderType[];
  languages: string[];
  menus: Menu[];
  id: number;
  organization: number;
  style: Style;
  logo: Image;
  mode: OrganizationMode;
  loginRequired: boolean;
  venue: Venue;
};
