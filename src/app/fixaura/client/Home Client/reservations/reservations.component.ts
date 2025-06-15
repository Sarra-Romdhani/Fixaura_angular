import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface Reservation {
  _id: string;
  service: string;
  date: string; // Formatted date (e.g., "2025-04-20")
  time: string; // Formatted time (e.g., "14:10")
  status: 'pending' | 'confirmed' | 'completed' | 'canceled' | 'waiting';
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
})
export class ReservationsComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  clientId: string | null = null;
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  private apiUrl = environment.baseUrl || 'http://localhost:3000';
  private querySubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.querySubscription = this.route.queryParams.subscribe(params => {
      this.clientId = params['clientId'] || null;
      console.log('ReservationsComponent - Client ID:', this.clientId);
      if (this.clientId) {
        this.loadReservations();
      } else {
        this.errorMessage = 'ID client manquant.';
      }
    });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  loadReservations() {
    if (!this.clientId) return;

    this.loading = true;
    this.errorMessage = null;
    this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/reservations/client/${this.clientId}/non-completed-or-canceled`).subscribe({
      next: (response) => {
        console.log('Raw API Response:', JSON.stringify(response, null, 2));
        this.reservations = response.success
          ? response.data.map(res => {
              let isoDate = 'Date inconnue';
              if (res.date?.$date) {
                isoDate = res.date.$date; // Nested $date
              } else if (typeof res.date === 'string') {
                isoDate = res.date; // Direct string
              } else if (res.date instanceof Object) {
                console.warn('Unexpected date format:', res.date);
              }
              let date = 'Date inconnue';
              let time = 'Heure inconnue';
              if (isoDate !== 'Date inconnue') {
                try {
                  const parsedDate = new Date(isoDate);
                  if (isNaN(parsedDate.getTime())) {
                    console.warn('Invalid date:', isoDate);
                  } else {
                    date = parsedDate.toISOString().split('T')[0]; // e.g., "2025-04-20"
                    time = parsedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); // e.g., "14:10"
                  }
                } catch (e) {
                  console.error('Date parsing error:', e, isoDate);
                }
              }
              return {
                _id: res._id,
                service: res.service || `Service #${res._id.slice(-6)}`,
                date,
                time,
                status: res.status || 'unknown',
              };
            })
          : [];
        console.log('Processed Reservations:', JSON.stringify(this.reservations, null, 2));
        this.filteredReservations = [...this.reservations];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.errorMessage = 'Erreur lors du chargement des réservations.';
        this.loading = false;
      },
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredReservations = [...this.reservations];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredReservations = this.reservations.filter(reservation =>
      (reservation.service || '').toLowerCase().includes(query)
    );
  }
}