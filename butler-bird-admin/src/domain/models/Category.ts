import { Typography } from "domain/models/Typography";
import { Image } from "domain/models/Image";

export interface Language {
  id: number;
  iso: string;
  published_at: Date;
  createdAt?: any;
  updatedAt?: any;
  created_at?: any;
  updated_at?: any;
}

export interface Name2 {
  id: number;
  language: Language;
  value: string;
}

export interface Language2 {
  id: number;
  iso: string;
  published_at: Date;
  createdAt?: any;
  updatedAt?: any;
  created_at?: any;
  updated_at?: any;
}

export interface Description2 {
  id: number;
  language: Language2;
  value: string;
}

export interface Language3 {
  id: number;
  iso: string;
  published_at: Date;
  createdAt?: any;
  updatedAt?: any;
  created_at?: any;
  updated_at?: any;
}

export interface Name3 {
  id: number;
  language: Language3;
  value: string;
}

export interface Option {
  id: number;
  price: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  createdAt?: any;
  updatedAt?: any;
}

export interface OptionGroup {
  id: number;
  selectionMode: string;
  required: boolean;
  name: Name3[];
  description: any[];
  options: Option[];
}

export interface Large2 {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: any;
  size: number;
  width: number;
  height: number;
}

export interface Small2 {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: any;
  size: number;
  width: number;
  height: number;
}

export interface Medium2 {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: any;
  size: number;
  width: number;
  height: number;
}

export interface Thumbnail2 {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: any;
  size: number;
  width: number;
  height: number;
}

export interface Formats2 {
  large: Large2;
  small: Small2;
  medium: Medium2;
  thumbnail: Thumbnail2;
}

export interface Image2 {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: Formats2;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: any;
  provider: string;
  provider_metadata?: any;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  createdAt?: Date;
  updatedAt: Date;
  name: Typography;
  description: Typography;
  image: Image | null;
  items: number[];
  menus: number[];
}
