

// export class Client {
//   id: string;
//   name: string;
//   email: string;
//   homeAddress: string;
//   image: string | undefined;
//   phoneNumber: string | undefined;

//   constructor(
//     id: string,
//     name: string,
//     email: string,
//     homeAddress: string,
//     image: string | undefined,
//     phoneNumber: string | undefined
//   ) {
//     this.id = id;
//     this.name = name;
//     this.email = email;
//     this.homeAddress = homeAddress;
//     this.image = image;
//     this.phoneNumber = phoneNumber;
//   }

//   static fromJson(json: any): Client {
//     return new Client(
//       json._id?.toString() ?? json.id?.toString() ?? 'unknown',
//       json.name?.toString() ?? 'Utilisateur inconnu',
//       json.email?.toString() ?? '',
//       json.homeAddress?.toString() ?? json.homeAddress?.toString() ?? '',
//       json.image?.toString() ?? undefined,
//       json.phoneNumber?.toString() ?? undefined
//     );
//   }
// }
export class Client {
  id: string;
  name: string;
  email: string;
  homeAddress: string;
  image?: string;
  phoneNumber?: string;

  constructor(
    id: string,
    name: string,
    email: string,
    homeAddress: string,
    image?: string,
    phoneNumber?: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.homeAddress = homeAddress;
    this.image = image;
    this.phoneNumber = phoneNumber;
  }

  static fromJson(json: any): Client {
    console.log('Raw client JSON:', json);
    return new Client(
      json._id?.toString() ?? json.id ?? 'unknown',
      json.name?.toString() ?? 'Utilisateur inconnu',
      json.email?.toString() ?? '',
      json.homeAddress?.toString() ?? '',
      json.image?.toString(),
      json.phoneNumber?.toString()
    );
  }
}