import { Typography } from "domain/models/Typography";
import { Image } from "domain/models/Image";
import { OptionGroup } from "domain/models/OptionGroup";

export interface Item {
  id: number;
  price: number;
  name: Typography;
  description?: Typography;
  longDescription?: Typography;
  optionGroups?: OptionGroup[];
  image?: File | Image | null;
  tags: number[];
  categories: number[];
  amount?: number;
}
