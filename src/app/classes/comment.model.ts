// export class Comment {
//   id?: string;
//   userId: string;
//   text: string;
//   createdAt: Date;
//   userName: any;
//   userImageUrl: any;
//   userType: any;

//   constructor(data: Partial<Comment>) {
//     this.id = data.id;
//     this.userId = data.userId ?? '';
//     this.text = data.text ?? '';
//     this.createdAt = data.createdAt ?? new Date();
//   }

//   static fromJson(json: any): Comment {
//     return new Comment({
//       id: json._id?.toString(),
//       userId: json.userId,
//       text: json.text,
//       createdAt: new Date(json.createdAt),
//     });
//   }

//   toJson(): { [key: string]: string } {
//     return {
//       userId: this.userId,
//       text: this.text,
//       createdAt: this.createdAt.toISOString(),
//     };
//   }
// }
























// comment.model.ts
// // comment.model.ts
// export class Comment {
//   id?: string;
//   userId: string;
//   text: string;
//   userName?: string;
//   userImageUrl?: string;
//   userType?: string;
//   timestamp?: string;

//   constructor(data: Partial<Comment>) {
//     this.id = data.id;
//     this.userId = data.userId || '';
//     this.text = data.text || '';
//     this.userName = data.userName;
//     this.userImageUrl = data.userImageUrl;
//     this.userType = data.userType;
//     this.timestamp = data.timestamp;
//   }

//   static fromJson(json: any): Comment {
//     return new Comment({
//       id: json.id,
//       userId: json.userId,
//       text: json.text,
//       userName: json.userName,
//       userImageUrl: json.userImageUrl,
//       userType: json.userType,
//       timestamp: json.timestamp,
//     });
//   }
// }
export class Comment {
  id?: string;
  userId: string;
  text: string;
  userName?: string;
  userImageUrl?: string;
  userType?: string;
  timestamp: string;

  constructor(data: Partial<Comment>) {
    this.id = data.id;
    this.userId = data.userId ?? '';
    this.text = data.text ?? '';
    this.userName = data.userName;
    this.userImageUrl = data.userImageUrl;
    this.userType = data.userType;
    this.timestamp = data.timestamp ?? new Date().toISOString();
  }

  static fromJson(json: any): Comment {
    return new Comment({
      id: json._id?.toString() || json.id?.toString(), // Map _id or id to string
      userId: json.userId,
      text: json.text,
      userName: json.userName,
      userImageUrl: json.userImageUrl,
      userType: json.userType,
      timestamp: json.createdAt || json.timestamp || new Date().toISOString()
    });
  }
}