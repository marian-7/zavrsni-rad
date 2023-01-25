export interface Printer {
  id: number;
  serialNumber: string;
  name: string;
  language: string;
  triggerLocations: number[];
  triggerVenues: number[];
  triggerTables: number[];
  // triggerOrderStatuses: any[];
  // triggerIncludeCanceledOrders?: any;
}
