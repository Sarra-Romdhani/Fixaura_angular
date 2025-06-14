export interface Message {
  isUser: boolean;
  text: string;
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

  constructor(
    id: string,
    name: string,
    image: string,
    lastMessage: string,
    unreadCount: number,
    timestamp: string,
    lastLanguage?: string,
    messages?: Message[]
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.lastMessage = lastMessage;
    this.unreadCount = unreadCount;
    this.timestamp = timestamp;
    this.lastLanguage = lastLanguage;
    this.messages = messages;
  }

  static fromJson(json: any): Conversation {
    return new Conversation(
      json['_id'].toString(),
      json['name'],
      json['image'] && json['image'].length > 0
        ? `http://f35.local:3000${json['image'].startsWith('/') ? json['image'] : '/' + json['image']}`
        : '',
      json['lastMessage'],
      json['unreadCount'],
      json['lastMessageTimestamp'],
      json['lastLanguage'],
      json['messages']?.map((msg: any) => ({
        isUser: msg.isUser,
        text: msg.text
      }))
    );
  }
}