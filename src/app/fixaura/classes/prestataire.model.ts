
export class Prestataire {
  constructor(
    public id: string ,
    public name: string ,
    public job: string ,
    public phoneNumber: string ,
    public businessAddress: string ,
    public facebook: string ,
    public instagram: string ,
    public website: string ,
    public image: string ,
    public rating: number | undefined,
    public email: string ,
    public ratingCount: number| undefined 
  ) {}

  static fromJson(json: any): Prestataire {
    console.log('[DEBUG] Prestataire JSON:', json);
    return new Prestataire(
      json._id?.toString(),
      json.name?.toString(),
      json.job?.toString(),
      json.phoneNumber?.toString(),
      json.businessAddress?.toString(),
      json.facebook?.toString(),
      json.instagram?.toString(),
      json.website?.toString(),
      json.image?.toString(),
      json.rating != null ? Number(json.rating) : undefined,
      json.email?.toString(),
      json.ratingCount != null ? Number(json.ratingCount) : undefined
    );
  }

  toJson(): any {
    return {
      ...(this.id && { _id: this.id }),
      ...(this.name && { name: this.name }),
      ...(this.job && { job: this.job }),
      ...(this.phoneNumber && { phoneNumber: this.phoneNumber }),
      ...(this.businessAddress && { businessAddress: this.businessAddress }),
      ...(this.facebook && { facebook: this.facebook }),
      ...(this.instagram && { instagram: this.instagram }),
      ...(this.website && { website: this.website }),
      ...(this.image && { image: this.image }),
      ...(this.rating != null && { rating: this.rating }),
      ...(this.email && { email: this.email }),
      ...(this.ratingCount != null && { ratingCount: this.ratingCount })
    };
  }
}