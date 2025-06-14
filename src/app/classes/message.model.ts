// import { environment } from "../environments/environment";
// import { Location } from './location.model';

import { environment } from "../environments/environment";

// export class Message {
//   id: string;
//   content: string;
//   isMe: boolean;
//   timestamp: string;
//   isRead: boolean;
//   isRatingPrompt: boolean;
//   reservationId?: string;
//   location?: Location;

//   constructor(data: any, senderId: string) {
//     this.id = data.id || Date.now().toString();
//     this.content = data.content || '';
//     this.isMe = data.senderId === senderId;
//     this.timestamp = data.timestamp || new Date().toISOString();
//     this.isRead = data.isRead || false;
//     this.isRatingPrompt = data.isRatingPrompt || false;
//     this.reservationId = data.reservationId;
//     this.location = data.coordinates ? new Location({ coordinates: data.coordinates, reservationId: data.reservationId }) : undefined;
//   }

//   get isLocationCard(): boolean {
//     return !!this.location && !!this.reservationId;
//   }
// }

// export class Conversation {
//   id: string;
//   name: string;
//   image: string;
//   lastMessage: string;
//   unreadCount: number;
//   timestamp: string;
//   lastLanguage?: string;
//   messages?: Message[];

//   constructor(data: any) {
//     this.id = data._id || data.id || '';
//     this.name = data.name || '';
//     this.image = data.image ? `${environment.baseUrl}${data.image.startsWith('/') ? data.image : '/' + data.image}` : '';
//     this.lastMessage = data.lastMessage || '';
//     this.unreadCount = data.unreadCount || 0;
//     this.timestamp = data.lastMessageTimestamp || data.timestamp || '';
//     this.lastLanguage = data.lastLanguage || '';
//     this.messages = data.messages ? data.messages.map((msg: any) => new Message(msg, data.senderId || '')) : [];
//   }
// }

import { Location } from './location.model';

export class Message {
  id: string;
  content: string;
  isMe: boolean;
  timestamp: string;
  isRead: boolean;
  isRatingPrompt: boolean;
  reservationId?: string;
  location?: Location;

  constructor(data: any, senderId: string) {
    this.id = data._id || data.id || Date.now().toString();
    this.content = data.content || '';
    this.isMe = data.senderId === senderId;
    // Use the backend-provided timestamp, fallback to current time only if absolutely necessary
    this.timestamp = data.timestamp || data.createdAt || (() => {
      console.warn(`No timestamp provided for message with ID ${this.id}. Using current time as fallback.`);
      return new Date().toISOString();
    })();
    this.isRead = data.isRead || false;
    this.isRatingPrompt = data.isRatingPrompt || false;
    this.reservationId = data.reservationId?.toString();
    this.location = data.location
      ? {
          id: data.location.id || Date.now().toString(),
          prestataireId: data.location.prestataireId || senderId,
          reservationId: data.reservationId || '',
          lat: data.location.lat,
          lng: data.location.lng,
          toJSON: () => ({
            id: data.location.id || Date.now().toString(),
            prestataireId: data.location.prestataireId || senderId,
            reservationId: data.reservationId || '',
            lat: data.location.lat,
            lng: data.location.lng
          })
        }
      : undefined;
  }

  get isLocationCard(): boolean {
    return !!this.location && !!this.reservationId;
  }
}

export class Conversation {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
  lastLanguage?: string;
  messages?: Message[];

  constructor(data: any) {
    this.id = data._id || data.id || '';
    this.name = data.name || '';
    this.image = data.image || '';
    this.lastMessage = data.lastMessage || '';
    this.unreadCount = data.unreadCount || 0;
    this.timestamp = data.lastMessageTimestamp || data.timestamp || '';
    this.lastLanguage = data.lastLanguage || '';
    this.messages = data.messages ? data.messages.map((msg: any) => new Message(msg, data.senderId || '')) : [];
  }
}