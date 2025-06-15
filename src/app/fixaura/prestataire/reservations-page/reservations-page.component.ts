import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../classes/reservation.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    NavbarComponent
  ],
  templateUrl: './reservations-page.component.html',
  styleUrls: ['./reservations-page.component.css']
})
export class ReservationsPageComponent implements OnInit, OnDestroy {
  confirmedReservations: Reservation[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  userId: string;
  loggedId: string; 

  unreadMessagesCount = 0;
  isSocketConnected = false;
  currentIndex = 2; // Reservations page index
  private socket: Socket | null = null;
  private messageCheckSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || 'someUserId';
    this.loggedId = this.route.snapshot.queryParamMap.get('loggedId') || this.userId; // Retrieve loggedId
    console.log('Initialized ReservationsPageComponent with userId:', this.userId);
  }

  ngOnInit() {
    this.loadReservations();
    this.connectSocket();
    this.startMessageCheckTimer();
  }

  loadReservations() {
    console.log('Starting loadReservations for userId:', this.userId);
    this.isLoading = true;
    this.reservationService.getConfirmedReservations(this.userId).subscribe({
      next: (reservations) => {
        console.log('Parsed confirmed reservations:', reservations);
        reservations.forEach(res => {
          console.log(`Client image for ${res.client.name}:`, res.client.image);
          console.log(`Reservation ID: ${res.id}, Prestataire ID: ${res.idPrestataire}`);
        });
        this.confirmedReservations = reservations || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.errorMessage = error.message || 'Erreur lors du chargement des réservations';
        this.isLoading = false;
        this.snackBar.open(this.errorMessage || '', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
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

  checkNewMessages(): Observable<void> {
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

  getImageUrl(image: string): string {
    console.log('Resolving image URL:', image);
    if (!image) return 'https://via.placeholder.com/48';
    if (image.startsWith('http')) return image;
    return `${environment.baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
  }

  logImageLoad(imageUrl: string) {
    console.log('Image loaded successfully:', imageUrl);
  }

  handleImageError(reservation: Reservation, event: Event) {
    console.error('Image failed to load for reservation:', reservation.id, 'Image:', reservation.client.image, event);
    reservation.client.image = '';
  }

  sendLocationCard(reservation: Reservation) {
    console.log('Initiating sendLocationCard for reservation:', reservation.id);
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      this.snackBar.open('La géolocalisation n\'est pas supportée par votre navigateur', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Geolocation obtained: lat=${latitude}, lng=${longitude}`);
        if (!reservation.id) {
          console.error('Invalid reservation ID');
          this.snackBar.open('ID de réservation invalide', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          return;
        }

        const prestataireId = reservation.idPrestataire || this.userId;
        console.log(`Using prestataireId: ${prestataireId}`);
        if (!prestataireId) {
          console.error('Invalid prestataire ID');
          this.snackBar.open('ID de prestataire introuvable', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          return;
        }

        this.reservationService.sendLocationCard(reservation.id, prestataireId, latitude, longitude)
          .subscribe({
            next: () => {
              console.log('Location card sent successfully');
              this.snackBar.open('Carte de localisation envoyée avec succès', 'Fermer', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.reservationService.startLocationUpdates(prestataireId, reservation.id)
                .subscribe({
                  next: () => {
                    console.log('Location updates started');
                    this.snackBar.open('Suivi de localisation démarré', 'Fermer', {
                      duration: 3000,
                      panelClass: ['success-snackbar']
                    });
                  },
                  error: (err) => {
                    console.error('Failed to start location updates:', err);
                    this.snackBar.open('Suivi de localisation non disponible', 'Fermer', {
                      duration: 3000,
                      panelClass: ['warning-snackbar']
                    });
                  }
                });
            },
            error: (err) => {
              console.error('Error sending location card:', err);
              this.snackBar.open(`Erreur: ${err.message}`, 'Fermer', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          });
      },
      (error) => {
        console.error('Geolocation error:', error.message, 'Code:', error.code);
        this.snackBar.open('Impossible d\'obtenir la localisation', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  cancelReservation(reservationId: string) {
    console.log('Cancel button clicked for reservation:', reservationId);
    if (!reservationId) {
      console.error('Invalid reservationId');
      this.snackBar.open('ID de réservation invalide', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    console.log('Proceeding with cancellation for reservationId:', reservationId);
    this.reservationService.cancelReservation(reservationId).subscribe({
      next: (result: any) => {
        console.log('Cancellation result:', result);
        this.reservationService.stopLocationUpdates().subscribe({
          next: () => console.log('Location updates stopped'),
          error: (err) => console.error('Error stopping location updates:', err)
        });
        this.snackBar.open('Réservation annulée avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        if (result.promotedReservation) {
          console.log('Promoted reservation:', result.promotedReservation);
          this.snackBar.open('Une réservation en attente a été passée en attente', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
        this.loadReservations();
      },
      error: (err) => {
        console.error('Error canceling reservation:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.snackBar.open(`Erreur: ${err.message}`, 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  navigateToHome() {
    console.log('Navigating to /home with userId:', this.userId);
    this.router.navigate(['/home', this.userId]);
  }

  ngOnDestroy() {
    console.log('Destroying ReservationsPageComponent');
    this.messageCheckSubscription?.unsubscribe();
    this.socket?.disconnect();
  }
}