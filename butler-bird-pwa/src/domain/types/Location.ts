interface Address {
  label: string;
}

export interface Position {
  lat?: number;
  lng?: number;
}

export interface SearchSuggestion {
  title: string;
  position: Position;
  address?: Address;
  id: string;
}

export interface Pin {
  id: number;
  latitude: number;
  longitude: number;
}

export interface UserAddressPosition {
  id: number;
  latitude: number;
  longitude: number;
}

export interface UserAddress {
  id: number;
  streetAddress: string;
  additionalInfo?: string;
  hereId: string;
  city: string;
  position: Position;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  deliveryInstructions?: string;
}
