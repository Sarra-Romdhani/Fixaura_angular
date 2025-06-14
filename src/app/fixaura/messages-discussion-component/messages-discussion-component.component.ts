import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SocketService } from '../../services/socket.service';
import { MessageService } from '../../services/message.service';
import { ReservationService } from '../../services/reservation.service';
import { Message } from '../../classes/message.model';
import { Location } from '../../classes/location.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface UserProfile {
  id: string;
  name: string;
  image: string;
}

@Component({
  selector: 'app-messages-discussion',
  templateUrl: './messages-discussion-component.component.html',
  styleUrls: ['./messages-discussion-component.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatSnackBarModule
  ]
})
export class MessagesDiscussionComponent implements OnInit, OnDestroy, AfterViewInit {
  userId: string = '';
  receiverId: string = '';
  userName: string = 'Unknown User';
  userImage: string = 'https://via.placeholder.com/40';
  currentUserProfile: UserProfile | null = null;
  receiverProfile: UserProfile | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  errorMessage: string = '';
  private isInDiscussion: boolean = true;
isLoading: boolean = true; // Add loading state
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService,
    private messageService: MessageService,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('MessagesDiscussionComponent: ngOnInit');
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.receiverId = this.route.snapshot.paramMap.get('receiverId') || '';

  // Read query parameters for userName and userImage
    this.route.queryParams.subscribe(params => {
      this.userName = params['userName'] || 'Unknown User';
      this.userImage = params['userImage']
        ? this.getFullImageUrl(params['userImage'])
        : 'https://via.placeholder.com/40';
      console.log('Query params:', { userName: this.userName, userImage: this.userImage });
    });

    if (!this.userId || !this.receiverId) {
      this.errorMessage = 'Invalid user or receiver ID';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      this.router.navigate(['/messages', this.userId]);
      return;
    }

    // Fetch profiles and messages
    this.fetchUserProfiles();
    this.fetchMessages();
    this.setupSocket();
  }

  private getFullImageUrl(imagePath: string): string {
    if (!imagePath || imagePath.trim() === '') {
      console.warn('[DEBUG] Image path is empty or undefined:', imagePath);
      return 'https://via.placeholder.com/40';
    }
    // If the image path is already a full URL, use it as is
    if (this.isValidUrl(imagePath)) {
      return imagePath;
    }
    // Otherwise, prepend the base URL
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const fullUrl = `${environment.baseUrl}${normalizedPath}?t=${new Date().getTime()}`;
    console.log('[DEBUG] Constructed image URL:', fullUrl);
    return fullUrl;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      console.warn('[DEBUG] Invalid URL:', url);
      return false;
    }
  }

  ngAfterViewInit(): void {
    console.log('MessagesDiscussionComponent: ngAfterViewInit');
    this.scrollToBottom();
  }

// private fetchUserProfiles(): void {
//     // Fetch current user profile
//     this.http.get<UserProfile>(`${environment.baseUrl}/clients/${this.userId}`).pipe(
//       catchError(() => this.http.get<UserProfile>(`${environment.baseUrl}/prestataires/${this.userId}`)),
//       catchError((err) => {
//         console.error('Error fetching current user profile:', err);
//         return of(null);
//       })
//     ).subscribe(profile => {
//       this.currentUserProfile = profile;
//       console.log('Current user profile:', this.currentUserProfile);
//     });

//     // Fetch receiver profile
//     this.http.get<UserProfile>(`${environment.baseUrl}/clients/${this.receiverId}`).pipe(
//       catchError(() => this.http.get<UserProfile>(`${environment.baseUrl}/prestataires/${this.receiverId}`)),
//       catchError((err) => {
//         console.error('Error fetching receiver profile:', err);
//         this.snackBar.open('Failed to load receiver profile', 'Close', { duration: 3000 });
//         return of(null);
//       })
//     ).subscribe(profile => {
//       this.receiverProfile = profile;
//       if (profile) {
//         // Update userName and userImage only if query params didn't provide them
//         if (this.userName === 'Unknown User') {
//           this.userName = profile.name || 'Unknown User';
//         }
//         if (this.userImage === 'https://via.placeholder.com/40') {
//           this.userImage = profile.image
//             ? this.getFullImageUrl(profile.image)
//             : 'https://via.placeholder.com/40';
//         }
//       }
//       this.isLoading = false; // Set loading to false once profile is fetched
//       console.log('Receiver profile:', this.receiverProfile, 'userName:', this.userName, 'userImage:', this.userImage);
//     });
//   }
private fetchUserProfiles(): void {
  // Fetch current user profile
  this.http.get<UserProfile>(`${environment.baseUrl}/clients/${this.userId}`).pipe(
    catchError(() => this.http.get<UserProfile>(`${environment.baseUrl}/prestataires/${this.userId}`)),
    catchError((err) => {
      console.error('Error fetching current user profile:', err);
      return of(null);
    })
  ).subscribe(profile => {
    this.currentUserProfile = profile;
    console.log('Current user profile:', this.currentUserProfile);
  });

  // Fetch receiver profile
  this.http.get<UserProfile>(`${environment.baseUrl}/clients/${this.receiverId}`).pipe(
    catchError(() => this.http.get<UserProfile>(`${environment.baseUrl}/prestataires/${this.receiverId}`)),
    catchError((err) => {
      console.error('Error fetching receiver profile:', err);
      this.snackBar.open('Failed to load receiver profile', 'Close', { duration: 3000 });
      return of(null);
    })
  ).subscribe(profile => {
    this.receiverProfile = profile;
    if (profile && profile.name && profile.image) {
      // Only update if profile data is valid and query params didn't provide specific values
      if (this.userName === 'Unknown User' || !this.route.snapshot.queryParamMap.get('userName')) {
        this.userName = profile.name;
      }
      if (this.userImage === 'https://via.placeholder.com/40' || !this.route.snapshot.queryParamMap.get('userImage')) {
        this.userImage = this.getFullImageUrl(profile.image);
      }
    } else {
      console.warn('Receiver profile incomplete:', profile);
    }
    this.isLoading = false;
    console.log('Receiver profile:', this.receiverProfile, 'userName:', this.userName, 'userImage:', this.userImage);
  });
}
  private fetchMessages(): void {
    console.log('Fetching messages for userId:', this.userId, 'receiverId:', this.receiverId);
    this.messageService.getMessages(this.userId, this.receiverId).subscribe({
      next: (messages) => {
        console.log('Messages fetched:', messages);
        messages.forEach(msg => {
          console.log(`Message ID: ${msg.id}, Timestamp: ${msg.timestamp}`);
        });
        this.messages = messages.filter(msg => !msg.isRatingPrompt);
        console.log('Filtered messages:', this.messages);
        this.markAllMessagesAsRead();
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
        this.errorMessage = 'Failed to load messages';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      }
    });
  }

  private setupSocket(): void {
    console.log('Setting up socket for userId:', this.userId);
    this.socketService.connect(
      this.userId,
      (data) => {
        console.log('Socket message received:', data);
        if (data.senderId === this.receiverId && data.receiverId === this.userId) {
          if (data.isRatingPrompt && data.reservationId) {
            console.log('Received rating prompt:', data.reservationId);
            this.handleRatingPrompt(data.reservationId);
          } else {
            const message = new Message({
              ...data,
              timestamp: data.timestamp || new Date().toISOString()
            }, this.userId);
            console.log('New message created:', message, 'isLocationCard:', message.isLocationCard);
            this.messages.push(message);
            this.scrollToBottom();
            if (this.isInDiscussion && !message.isMe) {
              this.markMessagesAsRead([message.id]);
            }
          }
        }
      },
      (messageIds) => {
        console.log('Messages marked as read:', messageIds);
        this.messages.forEach(msg => {
          if (messageIds.includes(msg.id)) {
            msg.isRead = true;
          }
        });
      }
    );

    this.socketService.on('startTracking', (data) => {
      console.log('startTracking event received:', data);
      if (data.reservationId && data.initialLocation?.lat && data.initialLocation?.lng) {
        const location: Location = {
          id: data.initialLocation.id || Date.now().toString(),
          prestataireId: data.initialLocation.prestataireId || this.receiverId,
          reservationId: data.reservationId,
          lat: data.initialLocation.lat,
          lng: data.initialLocation.lng,
          toJSON: () => ({
            id: data.initialLocation.id || Date.now().toString(),
            prestataireId: data.initialLocation.prestataireId || this.receiverId,
            reservationId: data.reservationId,
            lat: data.initialLocation.lat,
            lng: data.initialLocation.lng
          })
        };
        console.log('Navigating to map with location:', location);
        this.router.navigate([`/map/${this.userId}/${data.reservationId}`], {
          queryParams: { lat: location.lat, lng: location.lng, receiverId: this.receiverId }
        });
      } else {
        console.warn('Invalid startTracking data:', data);
      }
    });

    this.socketService.on('locationUpdate', (data) => {
      console.log('locationUpdate event received:', data);
      if (data.reservationId && data.location?.lat && data.location?.lng) {
        const message = new Message({
          id: Date.now().toString(),
          location: {
            id: data.location.id || Date.now().toString(),
            prestataireId: data.location.prestataireId || this.receiverId,
            reservationId: data.reservationId,
            lat: data.location.lat,
            lng: data.location.lng,
            toJSON: () => ({
              id: data.location.id || Date.now().toString(),
              prestataireId: data.location.prestataireId || this.receiverId,
              reservationId: data.reservationId,
              lat: data.location.lat,
              lng: data.location.lng
            })
          },
          reservationId: data.reservationId,
          timestamp: data.timestamp || new Date().toISOString(),
          senderId: this.receiverId
        }, this.userId);
        console.log('Location update message created:', message, 'isLocationCard:', message.isLocationCard);
        this.messages.push(message);
        this.scrollToBottom();
      } else {
        console.warn('Invalid locationUpdate data:', data);
      }
    });

    this.socketService.on('trigger-rating', (data) => {
      console.log('trigger-rating event received:', data);
      if (data.reservationId) {
        this.handleRatingPrompt(data.reservationId);
      }
    });
  }

  private handleRatingPrompt(reservationId: string): void {
    console.log('Handling rating prompt for reservationId:', reservationId);
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        if (reservation.client.id === this.userId && reservation.status === 'completed') {
          this.snackBar.open('Please rate the reservation', 'Close', { duration: 3000 });
          // TODO: Implement MatDialog for rating
        }
      },
      error: (error) => console.error('Error handling rating prompt:', error)
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const timestamp = new Date().toISOString();
    const message = new Message({
      id: Date.now().toString(),
      content: this.newMessage.trim(),
      senderId: this.userId,
      timestamp: timestamp,
      isRead: false
    }, this.userId);

    console.log('Sending text message:', message);
    this.messages.push(message);
    this.newMessage = '';
    this.scrollToBottom();

    this.messageService.sendMessage(this.userId, this.receiverId, message.content, timestamp).subscribe({
      error: (error) => {
        console.error('Error sending message:', error);
        this.snackBar.open('Failed to send message', 'Close', { duration: 3000 });
      }
    });

    this.socketService.emit('sendMessage', {
      senderId: this.userId,
      receiverId: this.receiverId,
      content: message.content,
      timestamp: timestamp
    });
  }

  private markAllMessagesAsRead(): void {
    const unreadMessageIds = this.messages
      .filter(msg => !msg.isMe && !msg.isRead)
      .map(msg => msg.id);
    if (unreadMessageIds.length > 0) {
      console.log('Marking messages as read:', unreadMessageIds);
      this.markMessagesAsRead(unreadMessageIds);
    }
  }

  private markMessagesAsRead(messageIds: string[]): void {
    this.messageService.markMessagesAsRead(messageIds, this.userId).subscribe({
      next: () => {
        this.socketService.emit('messages-read', messageIds);
      },
      error: (error) => console.error('Error marking messages as read:', error)
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages-list');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        console.log('Scrolled to bottom');
      } else {
        console.warn('Messages container not found');
      }
    }, 100);
  }

  getMessageContent(message: Message): Observable<{
    type: string;
    content?: string;
    reservationId?: string;
    lat?: number;
    lng?: number;
    qrCodeUrl?: string;
    error?: string;
  }> {
    console.log('getMessageContent called for message:', message, 'isLocationCard:', message.isLocationCard);
    if (message.isRatingPrompt) {
      console.log('Returning rating type for message:', message.id);
      return of({
        type: 'rating',
        content: message.content,
        reservationId: message.reservationId
      });
    }

    if (message.isLocationCard && message.location && message.reservationId) {
      console.log('Processing location card for message:', message.id, 'location:', message.location);
      return of({
        type: 'location',
        reservationId: message.reservationId,
        lat: message.location.lat,
        lng: message.location.lng
      });
    }

    if (message.content.includes('data:image/png;base64')) {
      console.log('Processing QR code for message:', message.id);
      try {
        const parts = message.content.split('Voici votre QR code avec les détails: ');
        if (parts.length < 2) {
          console.warn('QR code not found in content');
          return of({ type: 'error', error: 'QR code not found' });
        }
        const qrCodeData = parts[1].trim();
        const base64String = qrCodeData.startsWith('data:image/png;base64,')
          ? qrCodeData
          : `data:image/png;base64,${qrCodeData}`;
        return of({
          type: 'qr',
          qrCodeUrl: base64String
        });
      } catch (e) {
        console.error('QR code parsing error:', e);
        return of({ type: 'error', error: `Invalid QR code: ${e}` });
      }
    }

    console.log('Returning text type for message:', message.id);
    return of({ type: 'text', content: message.content });
  }

  getSenderInfo(message: Message): { name: string; image: string } {
    const isMe = message.isMe;
    const profile = isMe ? this.currentUserProfile : this.receiverProfile;
    return {
      name: profile?.name || (isMe ? 'Me' : 'Unknown User'),
      image: profile?.image ? `${environment.baseUrl}${profile.image}` : 'https://via.placeholder.com/40'
    };
  }

  // handleCardClick(reservationId: string, lat?: number, lng?: number): void {
  //   console.log('handleCardClick:', { reservationId, lat, lng, receiverId: this.receiverId });
  //   if (reservationId && lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
  //     this.router.navigate([`/map/${this.userId}/${reservationId}`], {
  //       queryParams: { lat, lng, receiverId: this.receiverId }
  //     });
  //   } else {
  //     console.warn('Invalid location data for card click');
  //     this.snackBar.open('Invalid location data', 'Close', { duration: 3000 });
  //   }
  // }
handleCardClick(reservationId: string, lat?: number, lng?: number): void {
  console.log('handleCardClick:', { reservationId, lat, lng, receiverId: this.receiverId });
  if (reservationId && lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    this.router.navigate([`/map/${this.userId}/${reservationId}`], {
      queryParams: {
        lat,
        lng,
        receiverId: this.receiverId,
        userName: this.userName, // Add userName
        userImage: this.userImage // Add userImage
      }
    });
  } else {
    console.warn('Invalid location data for card click');
    this.snackBar.open('Invalid location data', 'Close', { duration: 3000 });
  }
}
  handleRatingClick(reservationId: string): void {
    console.log('handleRatingClick:', reservationId);
    if (reservationId) {
      this.handleRatingPrompt(reservationId);
    }
  }

goBack(): void {
  console.log('Navigating back to messages list');
  this.router.navigate([`/messages/${this.userId}`]);
}

  ngOnDestroy(): void {
    console.log('MessagesDiscussionComponent: ngOnDestroy');
    this.isInDiscussion = false;
    this.socketService.disconnect();
  }

  // Helper method to check if the timestamp is from today
  isToday(timestamp: string): boolean {
    const messageDate = new Date(timestamp);
    const today = new Date();
    return (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    );
  }
}