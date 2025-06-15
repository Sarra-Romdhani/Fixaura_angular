export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  estimatedDuration: number;
  prestataireId: string;
  photo?: string;
  image?: File;
}