import { environment } from "../environments/environment";

export interface Location {
  id: string;
  prestataireId: string;
  reservationId: string;
  lat: number;
  lng: number;
  toJSON: () => any;
}