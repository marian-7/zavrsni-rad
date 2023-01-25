import { Typography } from "domain/models/Typography";

export enum SelectionMode {
  Single = "single",
  Multiple = "multiple",
}

export enum AccessLevel {
  Item = "item",
  Organization = "organization",
}

export interface Option {
  id?: number;
  price: number;
  name: Typography;
  description?: Typography;
  isNew?: boolean;
  amount?: number;
}

export interface OptionGroup {
  id?: number;
  selectionMode: SelectionMode;
  required: boolean;
  name: Typography;
  description?: Typography;
  options: Option[];
  isNew?: boolean;
  accessLevel: AccessLevel;
}
