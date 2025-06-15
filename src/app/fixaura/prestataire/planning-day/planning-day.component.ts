import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Reservation } from '../../classes/reservation.model';

@Component({
  selector: 'app-planning-day',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './planning-day.component.html',
  styleUrls: ['./planning-day.component.scss']
})
export class PlanningDayComponent {
  selectedDay: Date;
  reservations: Reservation[] = [];
  isLoading: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.selectedDay = state?.['selectedDay'] || new Date();
    this.reservations = state?.['reservations'] || [];
    console.log('[DEBUG] PlanningDayComponent: Initialized with', {
      selectedDay: this.selectedDay.toISOString(),
      reservations: this.reservations.map(r => ({
        id: r.id,
        date: r.date.toISOString(),
        service: r.service,
        price: r.price
      }))
    });
  }

  goBack(): void {
    this.router.navigate(['/profile', this.reservations[0]?.idPrestataire || '']);
  }
}