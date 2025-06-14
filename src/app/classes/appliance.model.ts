export interface Appliance {
  _id?: string;
  brand: string;
  modele: string;
  purchaseDate: string;
  usageFrequency: string;
  hasBrokenDown: boolean;
  breakdownDetails?: string;
  breakdownCount?: number;
  lastBreakdownDate?: string;
  lastMaintenanceDate?: string;
  image?: string;
  healthScore?: number;
  prediction?: {
    status: string;
    confidence: number;
    nextCheckDate: string;
  };
}