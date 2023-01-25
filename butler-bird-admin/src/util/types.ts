export enum RequestPolicy {
  CacheFirst = "cache-first",
}

export interface Option {
  value: any;
  label: string;
}

export enum OrderType {
  Canceled = "false",
  Active = "true",
  All = "all",
}
