import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Conversation } from '../classes/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private baseUrl = 'http://f35.local:3000';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  fetchConversations(userId: string): Observable<Conversation[]> {
    const url = `${this.baseUrl}/chatbot/conversations/${userId}`;
    console.log('Fetching conversations from:', url);
    return this.http.get<{ conversations: any[] }>(url, { headers: this.headers }).pipe(
      map(response => response.conversations.map(json => Conversation.fromJson(json))),
      catchError(error => {
        console.error('Error fetching conversations:', error);
        return throwError(() => new Error(`Failed to fetch conversations: ${error.message}`));
      })
    );
  }

  sendMessage(userId: string, message: string, language: string, conversationId?: string): Observable<{ response: string; conversationId?: string }> {
    const url = `${this.baseUrl}/chatbot/message`;
    const body = {
      userId,
      message,
      language,
      ...(conversationId && { conversationId })
    };
    console.log('Sending message to:', url, body);
    return this.http.post<{ response: string; conversationId?: string }>(url, body, { headers: this.headers }).pipe(
      catchError(error => {
        console.error('Error sending message:', error);
        return throwError(() => new Error(`Failed to send message: ${error.message}`));
      })
    );
  }
}