import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { environment } from '../../environments/environment';
import { Prestataire } from '../../classes/prestataire.model';
import { ReservationService } from '../../services/reservation.service';
import { PrestataireService } from '../../services/prestataire.service';
import { Reservation } from '../../classes/reservation.model';
import { NavbarComponent } from '../navbar/navbar.component';

interface Statistics {
  confirmed: number;
  pending: number;
}

@Component({
  selector: 'app-home-screen-prestataire',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    NavbarComponent
  ],
  templateUrl: './home-screen-prestataire.component.html',
  styleUrls: ['./home-screen-prestataire.component.css']
})
export class HomeScreenPrestataireComponent implements OnInit, OnDestroy {
  @ViewChild('messageNotification') messageNotification!: TemplateRef<any>;
  userId: string;
  searchControl = new FormControl('');
  pendingReservationsCount = 0;
  unreadMessagesCount = 0;
  allPrestataires: Prestataire[] = [];
  filteredPrestataires: Prestataire[] = [];
  statistics: Statistics | null = null;
  isLoading = true;
  isSearching = false;
  currentIndex = 0;
   loggedId: string = '';
  currentDiscussionReceiverId: string | null = null;
  pieChartOptions: any;
  barChartOptions: any;
  donutChartOptions: any;
  lineChartOptions: any;
  private socket: Socket;
  private isSocketConnected = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private prestataireService: PrestataireService,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.socket = io(environment.baseUrl, {
      transports: ['websocket'],
      autoConnect: true,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
  }
// Add a class property for loggedId
  ngOnInit(): void {

 this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loggedId = this.route.snapshot.queryParamMap.get('loggedId') || this.userId;

    console.log('Visited Prestataire ID:', this.userId);
    console.log('Logged-in User ID:', this.loggedId);





    this.loadInitialData();
    this.setupSocket();
    this.setupSearch();
    this.checkNewMessages();
    this.setupCharts();
  }

  setCurrentDiscussion(receiverId: string | null): void {
    this.currentDiscussionReceiverId = receiverId;
    console.log('Current discussion set to:', receiverId);
  }

  private setupSocket(): void {
    this.socket.on('connect', () => {
      this.socket.emit('join', this.userId);
      this.isSocketConnected = true;
      console.log('Socket connected for userId:', this.userId);
    });

    this.socket.on('newReservation', (data: any) => {
      console.log('New reservation received:', data);
      if (data.id_prestataire === this.userId) {
        this.pendingReservationsCount++;
        console.log('Incremented pendingReservationsCount to:', this.pendingReservationsCount);
        this.snackBar.open(`Vous avez 1 nouvelle(s) demande(s)`, 'Fermer', {
          duration: 3000,
          panelClass: ['reservation-snackbar']
        });
      }
    });

    this.socket.on('newMessage', (data: any) => {
      console.log('New message received:', data);
      if (data.receiverId === this.userId && data.senderId !== this.userId) {
        if (this.currentDiscussionReceiverId !== data.senderId) {
          const senderName = data.name || 'Unknown User';
          const senderImage = data.image || '';
          this.unreadMessagesCount++;
          console.log('Incremented unreadMessagesCount to:', this.unreadMessagesCount);
          this.snackBar.openFromTemplate(this.messageNotification, {
            data: { senderName, senderImage },
            duration: 3000,
            panelClass: ['message-snackbar']
          });
        }
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
      this.socket.emit('join', this.userId);
      console.log('Socket reconnected after', attempt, 'attempts');
    });

    this.socket.on('reservationUpdate', (data: any) => {
      console.log('Reservation update received:', data);
      if (data.prestataireId === this.userId) {
        this.pendingReservationsCount = Math.max(0, this.pendingReservationsCount - 1);
      }
    });

    this.socket.connect();

    setInterval(() => {
      if (this.isSocketConnected) {
        console.log('Polling for new messages');
        this.checkNewMessages();
      }
    }, 30000);
  }

  private loadInitialData(): void {
    forkJoin([
      this.prestataireService.getPrestatairesWithDifferentJobs(this.userId) as Observable<Prestataire[]>,
      this.prestataireService.getStatistics(this.userId) as Observable<Statistics>,
      this.reservationService.getPendingReservations(this.userId) as Observable<Reservation[]>
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([prestataires, statistics, reservations]: [Prestataire[], Statistics, Reservation[]]) => {
          this.allPrestataires = prestataires;
          this.filteredPrestataires = [...prestataires];
          console.log('Prestataire Images:', prestataires.map(p => ({ id: p.id, image: p.image })));
          this.statistics = statistics;
          this.pendingReservationsCount = reservations.length;
          this.isLoading = false;
          this.setupCharts();
        },
        error: (err) => {
          this.isLoading = false;
          this.showErrorSnackBar(`Erreur de chargement: ${err.message}`);
        }
      });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(query => {
          this.isSearching = true;
          if (!query?.trim()) {
            this.isSearching = false;
            this.filteredPrestataires = [...this.allPrestataires];
            return of([]);
          }
          return this.prestataireService.searchByNameWithDifferentJobs(this.userId, query.trim());
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          this.filteredPrestataires = results.length ? results : [...this.allPrestataires];
          this.isSearching = false;
        },
        error: (err) => {
          this.filteredPrestataires = [...this.allPrestataires];
          this.isSearching = false;
          this.showErrorSnackBar(`Erreur de recherche: ${err.message}`);
        }
      });
  }

  private checkNewMessages(): void {
    this.http
      .get<any[]>(`${environment.baseUrl}/messages/conversations?userId=${this.userId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const unreadCount = data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
          console.log('Fetched unread count from backend:', unreadCount);
          this.unreadMessagesCount = unreadCount;
        },
        error: (err) => console.error('Error checking messages:', err)
      });
  }

  private setupCharts(): void {
    const confirmed = this.statistics?.confirmed || 0;
    const pending = this.statistics?.pending || 0;
    const total = confirmed + pending;
    const hasData = total > 0;

    // Pie Chart (Existing)
    this.pieChartOptions = {
      series: hasData ? [confirmed, pending] : [1],
      chart: { type: 'pie', width: 150, height: 150 },
      labels: hasData ? ['Confirmed', 'Pending'] : ['No Data'],
      colors: hasData ? ['var(--confirmed-orange)', 'var(--pending-yellow)'] : ['var(--no-data-grey)'],
      dataLabels: { enabled: true, formatter: (val: number, opts: any) => opts.w.config.series[opts.seriesIndex] },
      legend: { show: false },
      stroke: { width: 3 }
    };

    // Bar Chart (Existing)
    this.barChartOptions = {
      series: [{ name: 'Bookings', data: hasData ? [confirmed, pending] : [0, 0] }],
      chart: { type: 'bar', width: 150, height: 150, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
      colors: hasData ? ['var(--confirmed-orange)', 'var(--pending-yellow)'] : ['var(--no-data-grey)'],
      xaxis: { categories: ['Confirmed', 'Pending'], labels: { style: { fontSize: '10px', colors: 'var(--text-primary)' } } },
      yaxis: { max: hasData ? total * 1.2 : 10, show: false },
      grid: { show: false },
      dataLabels: { enabled: false }
    };

    // Donut Chart (New)
    this.donutChartOptions = {
      series: hasData ? [confirmed, pending] : [1],
      chart: {
        type: 'donut',
        width: 150,
        height: 150
      },
      labels: hasData ? ['Confirmed', 'Pending'] : ['No Data'],
      colors: hasData ? ['var(--confirmed-orange)', 'var(--pending-yellow)'] : ['var(--no-data-grey)'],
      dataLabels: {
        enabled: true,
        formatter: (val: number, opts: any) => opts.w.config.series[opts.seriesIndex]
      },
      legend: { show: false },
      stroke: { width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      }
    };

    // Line Chart (New)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const confirmedData = hasData ? [confirmed/7, confirmed/7*1.2, confirmed/7*0.8, confirmed/7*1.1, confirmed/7*0.9, confirmed/7*1.3, confirmed/7*0.7].map(Math.round) : [0, 0, 0, 0, 0, 0, 0];
    const pendingData = hasData ? [pending/7, pending/7*0.9, pending/7*1.1, pending/7*0.8, pending/7*1.2, pending/7*0.7, pending/7*1.3].map(Math.round) : [0, 0, 0, 0, 0, 0, 0];

    this.lineChartOptions = {
      series: [
        {
          name: 'Confirmed',
          data: confirmedData
        },
        {
          name: 'Pending',
          data: pendingData
        }
      ],
      chart: {
        type: 'line',
        width: 200,
        height: 150,
        toolbar: { show: false }
      },
      colors: hasData ? ['var(--confirmed-orange)', 'var(--pending-yellow)'] : ['var(--no-data-grey)'],
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      xaxis: {
        categories: days,
        labels: {
          style: {
            fontSize: '10px',
            colors: 'var(--text-primary)'
          }
        }
      },
      yaxis: {
        max: hasData ? Math.max(...confirmedData, ...pendingData) * 1.3 : 10,
        labels: {
          style: {
            colors: 'var(--text-primary)'
          }
        }
      },
      grid: {
        borderColor: 'var(--light-grey)'
      },
      dataLabels: { enabled: false },
      tooltip: {
        theme: 'dark',
        x: { show: true },
        y: {
          formatter: (val: number) => `${val} bookings`
        }
      }
    };
  }

  refreshReservationCount(): void {
    this.reservationService
      .getPendingReservations(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reservations: Reservation[]) => {
          this.pendingReservationsCount = reservations.length;
        },
        error: (err: Error) => console.error('Error refreshing reservation count:', err)
      });
  }

  showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  navigateToNotifications(): void {
    this.router.navigate([`/notifications/${this.userId}`]);
  }

  navigateToChatbot(): void {
    this.router.navigate([`/chatbot/${this.userId}`]);
  }

  // navigateToProfile(prestataireId: string): void {
  //   this.router.navigate([`/profile/${prestataireId}`, { loggedInUserId: this.userId }]);
  // }
 // Add a class property for loggedId

navigateToProfile(prestataireId: string | undefined): void {
  if (!prestataireId || prestataireId.trim() === '') {
    this.snackBar.open('Invalid prestataire ID', 'Close', { duration: 3000 });
    console.error('Attempted to navigate with invalid prestataireId:', prestataireId);
    return;
  }
  console.log('Navigating to profile with prestataireId:', prestataireId, 'and loggedId:', this.loggedId);
  this.router.navigate(['/profile', prestataireId], {
    queryParams: { loggedId: this.loggedId }
  });
}


  callPhoneNumber(phoneNumber: string | undefined, event: Event): void {
    event.stopPropagation();
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      this.snackBar.open('Numéro non disponible', 'Fermer', {
        duration: 2000,
        panelClass: ['error-snackbar']
      });
    }
  }

  onImageError(event: Event, prestataireId: string | undefined): void {
    console.error(`Image failed to load for prestataire ${prestataireId}:`, (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).style.display = 'none';
  }

  onNotificationImageError(event: Event): void {
    console.error('Notification image failed to load:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).style.display = 'none';
  }

  getFilledStars(rating: number | undefined): number {
    return Math.floor(rating || 0);
  }

  hasValidImage(prestataire: Prestataire): boolean {
    return !!prestataire.image && prestataire.image.trim() !== '' && !!prestataire.image.match(/\/Uploads\//i);
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      console.warn('Image path is empty or undefined');
      return '';
    }
    const normalizedPath = imagePath.replace(/\/Uploads\//i, '/uploads/');
    const fullUrl = `${environment.baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}?t=${new Date().getTime()}`;
    console.log('Constructed Image URL:', fullUrl);
    return fullUrl;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socket.disconnect();
  }
}