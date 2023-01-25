import { Typography } from "domain/models/Typography";

interface Address {
  label: string;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface SearchSuggestion {
  title: string;
  position: Position;
  address: Address;
}

export interface Pin {
  id: number;
  latitude: number;
  longitude: number;
}

export interface Location {
  id: number;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: Typography;
  pins: Pin[];
  venues: number[];
  publishedAt?: Date;
}
