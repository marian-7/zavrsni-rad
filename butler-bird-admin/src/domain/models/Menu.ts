import { Typography } from "domain/models/Typography";
import { Image } from "domain/models/Image";

export interface Menu {
  id: number;
  activeTimeStart: string | null;
  activeTimeEnd: string | null;
  createdAt: Date;
  updatedAt: Date;
  name: Typography;
  description: Typography;
  categories: number[];
  itemCount: number;
  locations: number[];
  image: File | Image | null;
}
