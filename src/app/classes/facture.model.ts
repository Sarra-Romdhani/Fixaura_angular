

// export class Facture {
//   constructor(
//     public id: string,
//     public reservationId: string,
//     public prestataireId: string,
//     public clientId: string,
//     public service: string,
//     public date: Date,
//     public location: string,
//     public price?: number,
//     public discountApplied?: boolean,
//     public request?: string,
//     public pdfPath?: string
//   ) {}

//   static fromJson(json: any): Facture {
//     console.log('[DEBUG] Facture JSON:', json);
//     const reservation = json.reservation ?? json.reservationId ?? json._id;
//     const reservationId = typeof reservation === 'string'
//       ? reservation
//       : reservation?._id?.toString() ?? '';

//     return new Facture(
//       json._id?.toString() ?? '',
//       reservationId,
//       json.id_prestataire?.toString() ?? json.prestataireId?.toString() ?? '',
//       json.id_client?.toString() ?? json.clientId?.toString() ?? '',
//       json.service?.toString() ?? '',
//       json.date ? new Date(json.date) : new Date(),
//       json.location?.toString() ?? '',
//       json.price != null ? Number(json.price) : undefined,
//       json.discountApplied as boolean | undefined,
//       json.request?.toString(),
//       json.pdfPath?.toString()
//     );
//   }

//   toJson(): any {
//     return {
//       _id: this.id,
//       reservationId: this.reservationId,
//       prestataireId: this.prestataireId,
//       clientId: this.clientId,
//       service: this.service,
//       date: this.date.toISOString(),
//       location: this.location,
//       ...(this.price != null ? { price: this.price } : {}),
//       ...(this.discountApplied != null ? { discountApplied: this.discountApplied } : {}),
//       ...(this.request != null ? { request: this.request } : {}),
//       ...(this.pdfPath != null ? { pdfPath: this.pdfPath } : {})
//     };
//   }
// }


export class Facture {
  constructor(
    public id: string,
    public reservationId: string,
    public prestataireId: string,
    public clientId: string,
    public service: string,
    public date: Date,
    public location: string,
    public price?: number,
    public discountApplied?: boolean,
    public request?: string,
    public pdfPath?: string,
    public discountAmount?: number // Added
  ) {}

  static fromJson(json: any): Facture {
    console.log('[DEBUG] Facture JSON:', json);
    const reservation = json.reservation ?? json.reservationId ?? json._id;
    const reservationId = typeof reservation === 'string'
      ? reservation
      : reservation?._id?.toString() ?? '';

    return new Facture(
      json._id?.toString() ?? '',
      reservationId,
      json.id_prestataire?.toString() ?? json.prestataireId?.toString() ?? '',
      json.id_client?.toString() ?? json.clientId?.toString() ?? '',
      json.service?.toString() ?? '',
      json.date ? new Date(json.date) : new Date(),
      json.location?.toString() ?? '',
      json.price != null ? Number(json.price) : undefined,
      json.discountApplied as boolean | undefined,
      json.request?.toString(),
      json.pdfPath?.toString(),
      json.discountAmount != null ? Number(json.discountAmount) : undefined // Added
    );
  }

  toJson(): any {
    return {
      _id: this.id,
      reservationId: this.reservationId,
      prestataireId: this.prestataireId,
      clientId: this.clientId,
      service: this.service,
      date: this.date.toISOString(),
      location: this.location,
      ...(this.price != null ? { price: this.price } : {}),
      ...(this.discountApplied != null ? { discountApplied: this.discountApplied } : {}),
      ...(this.request != null ? { request: this.request } : {}),
      ...(this.pdfPath != null ? { pdfPath: this.pdfPath } : {}),
      ...(this.discountAmount != null ? { discountAmount: this.discountAmount } : {}) // Added
    };
  }
}