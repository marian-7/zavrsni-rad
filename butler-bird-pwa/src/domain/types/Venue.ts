export type Venue = {
  bannerMessage?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  id: number;
  location: Location;
  menuOrder: number[];
  organization: number;
};
