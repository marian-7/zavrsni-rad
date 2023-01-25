export type Small = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width: number;
  height: number;
};

export type Thumbnail = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width: number;
  height: number;
};

export type Formats = {
  small: Small;
  thumbnail: Thumbnail;
};

export type Image = {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url?: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: string;
  created_at: Date;
  updated_at: Date;
};
