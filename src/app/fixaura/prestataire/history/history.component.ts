import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Add Router
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../classes/reservation.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  currentTabIndex: number = 0;
  completedReservations: Reservation[] = [];
  canceledReservations: Reservation[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  prestataireId: string;
  isDarkMode: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router // Add Router
  ) {
    this.prestataireId = this.route.snapshot.paramMap.get('prestataireId') || '';
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reservationService.fetchReservations(this.prestataireId).pipe(
      map(reservations => {
        reservations.forEach(res => {
          res.date = res.date instanceof Date && !isNaN(res.date.getTime()) ? res.date : new Date();
          res.price = typeof res.price === 'number' && !isNaN(res.price) ? res.price : null;
        });
        this.completedReservations = reservations.filter(res => res.status.toLowerCase() === 'completed');
        this.canceledReservations = reservations.filter(res => res.status.toLowerCase() === 'canceled');
        console.log(`Completed: ${this.completedReservations.length}, Canceled: ${this.canceledReservations.length}`);
        if (this.completedReservations.length > 0) {
          const first = this.completedReservations[0];
          console.log(`First Completed -> ID: ${first.id}, Client: ${first.client.name}, Image: ${first.client.image}`);
        }
        this.isLoading = false;
        return reservations;
      }),
      catchError(error => {
        this.errorMessage = `Une erreur s'est produite : ${error.message}`;
        this.isLoading = false;
        return of([]);
      })
    ).subscribe();
  }

  setTab(index: number): void {
    this.currentTabIndex = index;
  }

  getCurrentReservations(): Reservation[] {
    return this.currentTabIndex === 0 ? this.completedReservations : this.canceledReservations;
  }

  getImageUrl(image: string | undefined): string {
    if (!image || image.trim() === '') {
      return 'assets/default_user.png';
    }
    if (image.startsWith('/uploads/')) {
      return `${this.reservationService['baseUrl']}${image}`;
    }
    return image;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/default_user.png';
  }

  goBack(): void {
    window.history.back();
  }

  goToProfile(): void {
    this.router.navigate(['/profile', this.prestataireId]); // Navigate to profile/:prestataireId
  }
}