// import { Comment } from './comment.model';

// export class Publication {
//   id?: string;
//   title: string;
//   description: string;
//   providerId: string;
//   image?: File;
//   imageUrl?: string;
//   likes: string[];
//   comments: Comment[];
//   createdAt?: Date;
//   updatedAt?: Date;

//   constructor(data: Partial<Publication>) {
//     this.id = data.id;
//     this.title = data.title ?? 'No title';
//     this.description = data.description ?? 'No description';
//     this.providerId = data.providerId ?? '';
//     this.image = data.image;
//     this.imageUrl = this.parseImageUrl(data.imageUrl);
//     this.likes = data.likes ?? [];
//     this.comments = data.comments ?? [];
//     this.createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
//     this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
//   }

//   private parseImageUrl(picture: string | undefined): string | undefined {
//     if (!picture || picture === 'undefined') return undefined;
//     return picture;
//   }

//   toJson(): { [key: string]: string } {
//     return {
//       title: this.title,
//       description: this.description,
//       providerId: this.providerId,
//     };
//   }

//   static fromJson(json: any): Publication {
//     return new Publication({
//       id: json._id,
//       title: json.title ?? 'No title',
//       description: json.description ?? 'No description',
//       providerId: json.providerId ?? '',
//       imageUrl: json.picture,
//       likes: json.likes ?? [],
//       comments: (json.comments ?? []).map((c: any) => Comment.fromJson(c)),
//       createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
//       updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
//     });
//   }
// }

// publication.model.ts



























// import { Comment } from './comment.model';

// export class Publication {
//   id?: string;
//   title: string;
//   description: string;
//   providerId: string;
//   image?: File[];
//   imageUrls?: string[];
//   duration?: number; // in minutes
//   price?: number; // in TND
//   likes: string[];
//   comments: Comment[];
//   createdAt?: Date;
//   updatedAt?: Date;

//   constructor(data: Partial<Publication>) {
//     this.id = data.id;
//     this.title = data.title ?? 'No title';
//     this.description = data.description ?? 'No description';
//     this.providerId = data.providerId ?? '';
//     this.image = data.image;
//     this.imageUrls = data.imageUrls ?? [];
//     this.duration = data.duration;
//     this.price = data.price;
//     this.likes = data.likes ?? [];
//     this.comments = data.comments ?? [];
//     this.createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
//     this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
//   }

//   static fromJson(json: any): Publication {
//     return new Publication({
//       id: json._id,
//       title: json.title ?? 'No title',
//       description: json.description ?? 'No description',
//       providerId: json.providerId ?? '',
//       imageUrls: json.pictures ?? [],
//       duration: json.estimatedDuration,
//       price: json.price,
//       likes: json.likes ?? [],
//       comments: (json.comments ?? []).map((c: any) => Comment.fromJson(c)),
//       createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
//       updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined,
//     });
//   }
// }
import { Comment } from './comment.model';
export class Publication {
  id?: string;
  title: string;
  description: string;
  providerId: string;
  image?: File[] | null;
  imageUrls?: string[];
  likes: string[];
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;

  constructor(data: Partial<Publication>) {
    this.id = data.id;
    this.title = data.title ?? '';
    this.description = data.description ?? '';
    this.providerId = data.providerId ?? '';
    this.image = data.image ?? null;
    this.imageUrls = data.imageUrls ?? [];
    this.likes = data.likes ?? [];
    this.comments = data.comments ?? [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromJson(json: any): Publication {
    return new Publication({
      id: json._id?.toString() || json.id?.toString(),
      title: json.title ?? '',
      description: json.description ?? '',
      providerId: json.providerId ?? '',
      image: json.image,
      imageUrls: json.pictures ?? json.imageUrls ?? [],
      likes: json.likes ?? [],
      comments: (json.comments ?? []).map((c: any) => Comment.fromJson(c)),
      createdAt: json.createdAt,
      updatedAt: json.updatedAt
    });
  }
}