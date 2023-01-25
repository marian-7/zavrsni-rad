export interface Language {
  id: number;
  iso: string;
}

export interface Name {
  id: number;
  language: Language;
  value: string;
}

export interface OrderStatus {
  id: number;
  notifySender: boolean;
  notifyRecipient: boolean;
  marksOrderComplete: boolean;
  type?: "takeout" | "standard";
  name: Name[];
}
