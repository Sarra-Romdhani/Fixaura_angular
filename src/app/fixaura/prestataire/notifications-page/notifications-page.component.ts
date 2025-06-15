import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../classes/reservation.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NavbarComponent
  ],
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
  pendingReservations: Reservation[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  userId: string;
  primaryColor = '#ff9800';
  currentIndex = 2; // Notifications page index
  unreadMessagesCount = 0;
  isSocketConnected = false;
  private socket: Socket | null = null;
  private messageCheckSubscription: Subscription | null = null;
  private imageUrlCache: Map<string, string> = new Map();
  private validImageCache: Map<string, boolean> = new Map();

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || 'someUserId';
    console.log('Initialized NotificationsPageComponent with userId:', this.userId);
  }

  ngOnInit() {
    this.refreshData();
    this.connectSocket();
    this.startMessageCheckTimer();
  }

  navigateToHome() {
    console.log('[DEBUG] Navigating to home');
    this.router.navigate(['/home', this.userId]);
  }

  refreshData() {
    this.isLoading = true;
    this.errorMessage = null;
    this.imageUrlCache.clear();
    this.validImageCache.clear();
    this.reservationService.getPendingReservations(this.userId).subscribe({
      next: (reservations) => {
        console.log('[DEBUG] Parsed reservations:', reservations);
        this.pendingReservations = reservations || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[DEBUG] Error fetching reservations:', error);
        this.errorMessage = error.message || 'Une erreur est survenue';
        this.isLoading = false;
      }
    });
  }

  async handleReservationAction(reservationId: string, action: string) {
    try {
      console.log(`[DEBUG] Handling ${action} for reservation ${reservationId}`);
      const reservation = await this.reservationService.getReservationById(reservationId).toPromise();
      if (!reservation) {
        throw new Error('Réservation non trouvée');
      }

      if (action === 'accept') {
        await this.reservationService.updateReservationStatus(reservationId, 'confirmed').toPromise();
        console.log('[DEBUG] Reservation confirmed, navigating to messages');
        this.router.navigate([`/messages/discussion/${this.userId}/${reservation.client.id}`], {
          queryParams: {
            userName: reservation.client.name,
            userImage: reservation.client.image,
          }
        });
        this.snackBar.open('Réservation confirmée !', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.pendingReservations = this.pendingReservations.filter(res => res.id !== reservationId);
      } else if (action === 'decline') {
        await this.reservationService.deleteReservation(reservationId).toPromise();
        console.log('[DEBUG] Reservation declined');
        this.snackBar.open('Réservation annulée !', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.pendingReservations = this.pendingReservations.filter(res => res.id !== reservationId);
      }
    } catch (error: any) {
      console.error('[DEBUG] Error in handleReservationAction:', error);
      let errorMessage = 'Une erreur est survenue';
      if (error.status === 404) {
        errorMessage = 'Réservation non trouvée';
        this.pendingReservations = this.pendingReservations.filter(res => res.id !== reservationId);
      } else if (error.status === 400) {
        errorMessage = `Requête invalide: ${error.error?.message || 'Erreur de requête'}`;
        this.refreshData();
      } else if (error.status === 500) {
        errorMessage = 'Erreur serveur: La suppression a peut-être réussi';
        this.pendingReservations = this.pendingReservations.filter(res => res.id !== reservationId);
      } else {
        errorMessage = error.message || 'Erreur inattendue';
        this.refreshData();
      }
      this.snackBar.open(`Erreur: ${errorMessage}`, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  retry() {
    this.refreshData();
  }

  connectSocket() {
    this.socket = io(environment.baseUrl, {
      transports: ['websocket'],
      autoConnect: true,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      this.isSocketConnected = true;
      this.socket?.emit('join', this.userId);
      console.log(`Socket connected for userId: ${this.userId}`);
    });

    this.socket.on('newMessage', (data: any) => {
      console.log('New message received:', data);
      if (data.receiverId === this.userId && data.senderId !== this.userId) {
        this.unreadMessagesCount++;
        console.log(`Incremented unreadMessagesCount to: ${this.unreadMessagesCount}`);
        this.snackBar.open(`Nouveau message reçu de ${data.senderName || 'Inconnu'}`, 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.checkNewMessages();
      }
    });

    this.socket.on('messages-read', (messageIds: any) => {
      console.log('Messages read event:', messageIds);
      this.checkNewMessages();
    });

    this.socket.on('connect_error', (error: any) => {
      this.isSocketConnected = false;
      console.log('Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason: any) => {
      this.isSocketConnected = false;
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('reconnect', (attempt: number) => {
      this.isSocketConnected = true;
      this.socket?.emit('join', this.userId);
      console.log(`Socket reconnected after ${attempt} attempts`);
    });

    this.socket.connect();
  }

  startMessageCheckTimer() {
    console.log('Starting message check timer');
    this.messageCheckSubscription = timer(0, 30000).pipe(
      switchMap(() => this.checkNewMessages())
    ).subscribe();
  }

  checkNewMessages() {
    console.log('Checking new messages for userId:', this.userId);
    return this.http.get<any[]>(`${environment.baseUrl}/messages/conversations?userId=${this.userId}`, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    }).pipe(
      switchMap(data => {
        const unreadCount = data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        console.log('Fetched unread count:', unreadCount);
        this.unreadMessagesCount = unreadCount;
        return new Observable<void>(observer => observer.complete());
      })
    );
  }

  hasValidImage(reservation: Reservation): boolean {
    const image = reservation.client.image;
    const cacheKey = `${reservation.id}-${image || ''}`;
    if (this.validImageCache.has(cacheKey)) {
      return this.validImageCache.get(cacheKey)!;
    }
    console.log(`[DEBUG] hasValidImage(resId=${reservation.id}, image=${image}, type=${typeof image})`);
    const isValid = !!image && image.trim() !== '' && image.startsWith('/uploads/');
    this.validImageCache.set(cacheKey, isValid);
    return isValid;
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath || imagePath.trim() === '') {
      console.warn(`[DEBUG] Image path empty or undefined: ${imagePath}`);
      return '';
    }
    if (this.imageUrlCache.has(imagePath)) {
      return this.imageUrlCache.get(imagePath)!;
    }
    const normalizedPath = imagePath.replace(/\/Uploads\//i, '/uploads/');
    const timestamp = Math.floor(Date.now() / 1000);
    const fullUrl = `${environment.baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}?t=${timestamp}`;
    console.log(`[DEBUG] Constructed image URL: ${fullUrl}`);
    this.imageUrlCache.set(imagePath, fullUrl);
    return fullUrl;
  }

  onImageError(event: Event, reservationId: string | undefined): void {
    console.error(`[DEBUG] Image failed to load for reservation ${reservationId}:`, (event.target as HTMLImageElement).src);
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    const avatarContainer = imgElement.closest('.avatar');
    if (avatarContainer) {
      const placeholder = avatarContainer.querySelector('.placeholder-icon');
      if (placeholder) {
        (placeholder as HTMLElement).style.display = 'flex';
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      console.warn(`[DEBUG] Invalid URL: ${url}`);
      return false;
    }
  }

  ngOnDestroy() {
    console.log('Destroying NotificationsPageComponent');
    this.messageCheckSubscription?.unsubscribe();
    this.socket?.disconnect();
  }

}