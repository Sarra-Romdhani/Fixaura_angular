import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface Booking {
  service: string;
  date: string;
  time: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit, OnDestroy {
  status: string = ''; // Filter: '', 'canceled', or 'completed'
  bookings: Booking[] = [];
  private clientId: string | null = null;
  private category: string | null = null;
  private subscription: Subscription | null = null;
  private apiUrl = environment.baseUrl || 'http://localhost:3000';
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.subscription = this.route.queryParamMap.subscribe(params => {
      this.clientId = params.get('clientId');
      this.category = params.get('category');
      console.log('HistoriqueComponent - Query Params:', { clientId: this.clientId, category: this.category });
      if (this.clientId) {
        this.fetchReservations();
      } else {
        this.errorMessage = 'Aucun ID utilisateur fourni dans l\'URL.';
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setStatus(newStatus: string) {
    this.status = this.status === newStatus ? '' : newStatus;
    console.log('Filter status set to:', this.status);
    this.fetchReservations();
  }

  fetchReservations() {
    if (!this.clientId) return;
    this.loading = true;
    this.errorMessage = null;

    let endpoint = `${this.apiUrl}/reservations/client/${this.clientId}`;
    if (this.status === 'canceled') {
      endpoint += '/canceled';
    } else if (this.status === 'completed') {
      endpoint += '/completed';
    } else {
      endpoint += '/canceled'; // Fetch canceled by default
    }

    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.get<ApiResponse<any[]>>(endpoint, { headers, responseType: 'json' }).subscribe({
      next: (response) => {
        console.log('Reservations API Raw Response:', JSON.stringify(response, null, 2));
        if (response.success && Array.isArray(response.data)) {
          this.bookings = response.data.map(reservation => ({
            service: reservation.service || 'Unknown Service',
            date: this.formatDate(reservation.date),
            time: this.formatTime(reservation.date),
            status: reservation.status || 'unknown',
            action: reservation.status === 'completed' ? 'Rate' : 'Book Again'
          }));
          console.log('Processed Bookings:', JSON.stringify(this.bookings, null, 2));
        } else {
          this.errorMessage = 'Aucune réservation trouvée.';
          this.bookings = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.errorMessage = err.status === 404
          ? 'Aucune réservation trouvée.'
          : 'Erreur lors de la récupération des réservations.';
        this.bookings = [];
        this.loading = false;
      }
    });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Date inconnue';
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  }

  formatTime(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Heure inconnue';
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  navigateToProfile() {
    console.log('Navigating back to profile with:', { clientId: this.clientId, category: this.category });
    this.router.navigate(['/client/profile'], {
      queryParams: {
        clientId: this.clientId,
        category: this.category
      }
    });
  }

  onAction(provider: string, action: string) {
    if (action === 'Book Again') {
      console.log(`Booking again with , navigating to top-bar-hom`);
      this.router.navigate(['/client/top-bar-home'], {
        queryParams: {
          clientId: this.clientId,
          category: this.category
        }
      });
    } else if (action === 'Rate') {
      console.log(`Rating `);
      // Navigate to rating page
    }
  }
}