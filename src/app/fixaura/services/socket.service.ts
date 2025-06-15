// import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
// import { environment } from '../environments/environment';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {
//   private socket: Socket | null = null;
// private unreadMessagesCount = new BehaviorSubject<number>(0);
//   connect(
//     userId: string,
//     onMessage?: (data: any) => void,
//     onMessagesRead?: (messageIds: string[]) => void,
//     onDisconnect?: () => void
//   ): void {
//     if (this.socket) {
//       this.socket.disconnect();
//     }

//     this.socket = io(environment.baseUrl, {
//       query: { userId },
//       transports: ['websocket'],
//       autoConnect: true,
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1000,
//       //pingInterval: 25000,
//       //pingTimeout: 60000
//     });

//     this.socket.on('connect', () => {
//       console.log('Socket connected:', userId);
//       this.socket?.emit('join', userId);
//     });

//     this.socket.on('connect_error', (err: any) => console.error('Connection error:', err));
//     this.socket.on('error', (err: any) => console.error('Socket error:', err));
//     this.socket.on('reconnect', (attempt: number) => {
//       console.log('Socket reconnected after', attempt, 'attempts');
//       this.socket?.emit('join', userId);
//     });
//     this.socket.on('reconnect_error', (err: any) => console.error('Socket reconnect error:', err));

//     if (onMessage) {
//       this.socket.on('newMessage', onMessage);
//     }
//     if (onMessagesRead) {
//       this.socket.on('messages-read', onMessagesRead);
//     }
//     if (onDisconnect) {
//       this.socket.on('disconnect', onDisconnect);
//     }
//   }

//   on(event: string, callback: (...args: any[]) => void): void {
//     if (this.socket) {
//       if (event === 'any') {
//         this.socket.onAny((eventName, ...args) => callback(eventName, ...args));
//       } else {
//         this.socket.on(event, (...args) => callback(...args));
//       }
//     } else {
//       console.warn(`Cannot listen to ${event}: Socket is not connected`);
//     }
//   }

//   emit(event: string, data: any): void {
//     if (this.socket) {
//       console.log('Emitting', event, data);
//       this.socket.emit(event, data);
//     } else {
//       console.warn(`Cannot emit ${event}: Socket is not connected`);
//     }
//   }

//   joinReservation(reservationId: string, userId: string): void {
//     this.emit('joinReservation', { reservationId, userId });
//   }
// getUnreadMessagesCount() {
//     return this.unreadMessagesCount.asObservable();
//   }
//   disconnect(): void {
//     if (this.socket) {
//       this.socket.off('newMessage');
//       this.socket.off('messages-read');
//       this.socket.off('trigger-rating');
//       this.socket.off('locationUpdate-*');
//       this.socket.off('startTracking');
//       this.socket.disconnect();
//       this.socket = null;
//       console.log('Socket disconnected');
//     }
//   }
// }


import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private unreadMessagesCount = new BehaviorSubject<number>(0);

  connect(
    userId: string,
    onMessage?: (data: any) => void,
    onMessagesRead?: (messageIds: string[]) => void,
    onDisconnect?: () => void
  ): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(environment.baseUrl, {
      query: { userId },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', userId);
      this.socket?.emit('join', userId);
    });

    this.socket.on('connect_error', (err: any) => console.error('Connection error:', err));
    this.socket.on('error', (err: any) => console.error('Socket error:', err));
    this.socket.on('reconnect', (attempt: number) => {
      console.log('Socket reconnected after', attempt, 'attempts');
      this.socket?.emit('join', userId);
    });
    this.socket.on('reconnect_error', (err: any) => console.error('Socket reconnect error:', err));

    if (onMessage) {
      this.socket.on('newMessage', onMessage);
    }
    if (onMessagesRead) {
      this.socket.on('messages-read', onMessagesRead);
    }
    if (onDisconnect) {
      this.socket.on('disconnect', onDisconnect);
    }
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      if (event === 'any') {
        this.socket.onAny((eventName, ...args) => callback(eventName, ...args));
      } else {
        this.socket.on(event, (...args) => callback(...args));
      }
    } else {
      console.warn(`Cannot listen to ${event}: Socket is not connected`);
    }
  }

  emit(event: string, data: any): void {
    if (this.socket) {
      console.log('Emitting', event, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: Socket is not connected`);
    }
  }

  joinReservation(reservationId: string, userId: string): void {
    this.emit('joinReservation', { reservationId, userId });
  }

  getUnreadMessagesCount(): Observable<number> {
    return this.unreadMessagesCount.asObservable();
  }

  // New method to update unread messages count
  setUnreadMessagesCount(count: number): void {
    this.unreadMessagesCount.next(count);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.off('newMessage');
      this.socket.off('messages-read');
      this.socket.off('trigger-rating');
      this.socket.off('locationUpdate-*');
      this.socket.off('startTracking');
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected');
    }
  }
}