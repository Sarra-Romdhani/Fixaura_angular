

// import { Client } from "./client.model";

// export class Reservation {
//   id: string;
//   client: Client;
//   idPrestataire: string;
//   date: Date;
//   location: string;
//   status: string;
//   service: string;
//   price: number | null;
//   request: string | null;
//   discountApplied: boolean;

//   constructor(
//     id: string,
//     client: Client,
//     idPrestataire: string,
//     date: Date,
//     location: string,
//     status: string,
//     service: string,
//     price: number | null,
//     request: string | null,
//     discountApplied: boolean
//   ) {
//     this.id = id;
//     this.client = client;
//     this.idPrestataire = idPrestataire;
//     this.date = date;
//     this.location = location;
//     this.status = status;
//     this.service = service;
//     this.price = price;
//     this.request = request;
//     this.discountApplied = discountApplied;
//   }

//   static fromJson(json: any): Reservation {
//     console.log('Raw reservation JSON:', json); // Debug
//     const client = json.client ? Client.fromJson(json.client) : Client.fromJson({});
//     console.log('Parsed client:', client); // Debug
//     return new Reservation(
//       json._id?.toString() ?? json.id ?? 'unknown',
//       client,
//       json.id_prestataire?.toString() ?? 'unknown', // Ensure id_prestataire is always a string
//       json.date ? new Date(json.date) : new Date(),
//       json.location?.toString() ?? 'Adresse non spécifiée',
//       json.status?.toString() ?? 'unknown',
//       json.service?.toString() ?? 'Service non spécifié',
//       json.price ? parseFloat(json.price) : null,
//       json.request?.toString() ?? null,
//       json.discountApplied ?? false
//     );
//   }
// }


import { Client } from "./client.model";

export class Reservation {
  id: string;
  client: Client;
  idPrestataire: string;
  date: Date;
  location: string;
  status: string;
  service: string;
  price: number | null;
  request: string | null;
  discountApplied: boolean;

  constructor(
    id: string,
    client: Client,
    idPrestataire: string,
    date: Date,
    location: string,
    status: string,
    service: string,
    price: number | null,
    request: string | null,
    discountApplied: boolean
  ) {
    this.id = id;
    this.client = client;
    this.idPrestataire = idPrestataire;
    this.date = date;
    this.location = location;
    this.status = status;
    this.service = service;
    this.price = price;
    this.request = request;
    this.discountApplied = discountApplied;
  }

  static fromJson(json: any): Reservation {
    console.log('Raw reservation JSON:', json);
    const client = json.client ? Client.fromJson(json.client) : Client.fromJson({});
    console.log('Parsed client:', client);
    return new Reservation(
      json._id?.toString() ?? json.id ?? 'unknown',
      client,
      json.id_prestataire?.toString() ?? 'unknown',
      json.date ? new Date(json.date) : new Date(),
      json.location?.toString() ?? 'Adresse non spécifiée',
      json.status?.toString() ?? 'unknown',
      json.service?.toString() ?? 'Service non spécifié',
      json.price ? parseFloat(json.price) : null,
      json.request?.toString() ?? null,
      json.discountApplied ?? false
    );
  }
}