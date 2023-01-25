import { Typography } from "domain/models/Typography";

export enum AccessLevel {
  Global = "global",
  Organization = "organization",
  Item = "item",
}

export interface Tag {
  id: number;
  published_at: Date;
  createdAt: Date;
  updatedAt: Date;
  name: Typography;
  item: number[];
  accessLevel: AccessLevel;
}
