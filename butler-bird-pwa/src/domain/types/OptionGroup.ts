import { Option } from "domain/types/Option";

export type SelectionMode = "single" | "multiple";

export type OptionGroup = {
  id: number;
  name: Record<string, string>;
  description: Record<string, string>;
  required: boolean;
  selectionMode: SelectionMode;
  options: Option[];
};
