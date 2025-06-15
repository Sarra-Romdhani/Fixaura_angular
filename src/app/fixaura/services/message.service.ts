import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Conversation, Message } from '../classes/message.model';

// Interface for prestataire and client search results
interface SearchResult {
  _id: string;
  name: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = `${environment.baseUrl}/messages`;

  constructor(private http: HttpClient) {}

  getConversations(userId: string): Observable<Conversation[]> {
    return this.http.get<any[]>(`${this.baseUrl}/conversations?userId=${userId}`).pipe(
      map(data => data.map(conv => new Conversation(conv))),
      catchError(error => {
        console.error('Failed to load conversations:', error);
        throw new Error('Failed to load conversations');
      })
    );
  }

  getMessages(senderId: string, receiverId: string): Observable<Message[]> {
    return this.http.get<any[]>(`${this.baseUrl}?user1Id=${senderId}&user2Id=${receiverId}`).pipe(
      map(data => data.map(msg => new Message(msg, senderId))),
      catchError(error => {
        console.error('Failed to load messages:', error);
        throw new Error('Failed to load messages');
      })
    );
  }

sendMessage(senderId: string, receiverId: string, content: string, timestamp?: string): Observable<void> {
  return this.http.post<void>(this.baseUrl, {
    senderId,
    receiverId,
    content,
    timestamp: timestamp || new Date().toISOString() // Include timestamp in the payload
  }, {
    headers: { 'Content-Type': 'application/json' }
  }).pipe(
    catchError(error => {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    })
  );
}

  markMessagesAsRead(messageIds: string[], readerId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/markAsRead`, {
      messageIds,
      readerId
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(error => {
        console.error('Failed to mark messages as read:', error);
        throw new Error('Failed to mark messages as read');
      })
    );
  }

  searchClients(query: string, excludeId: string): Promise<SearchResult[]> {
    return firstValueFrom(
      this.http.get<{ data: SearchResult[] | null }>(`${environment.baseUrl}/clients/search?query=${encodeURIComponent(query)}&excludeId=${excludeId}`)
        .pipe(
          map(response => response.data ?? []),
          catchError(error => {
            console.error('Failed to search clients:', error);
            return of([] as SearchResult[]);
          })
        )
    );
  }

  searchPrestataires(query: string): Promise<SearchResult[]> {
    return firstValueFrom(
      this.http.get<{ data: SearchResult[] | null }>(`${environment.baseUrl}/prestataires/search?name=${encodeURIComponent(query)}`)
        .pipe(
          map(response => response.data ?? []),
          catchError(error => {
            console.error('Failed to search prestataires:', error);
            return of([] as SearchResult[]);
          })
        )
    );
  }
  
}