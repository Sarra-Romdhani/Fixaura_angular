




import { Component, Inject, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule, MatDatepickerIntl, MatCalendarHeader, MatCalendar } from '@angular/material/datepicker';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../classes/reservation.model';
import { DateAdapter, MatNativeDateModule, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { A11yModule } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { NativeDateAdapter } from '@angular/material/core';

const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-custom-calendar-header',
  template: `
    <div class="mat-calendar-header">
      <button class="icon-button" (click)="previousClicked()" aria-label="Mois précédent">
        <i class="bi bi-chevron-left"></i>
      </button>
      <span>{{ periodLabel }}</span>
      <button class="icon-button" (click)="nextClicked()" aria-label="Mois suivant">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
  `,
  styles: [`
    .mat-calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    .icon-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      font-size: 20px;
      color: #333;
    }
    .icon-button:hover {
      color: #007bff;
    }
  `]
})
class CustomCalendarHeader extends MatCalendarHeader<any> {
  private dateAdapter: DateAdapter<any>;

  constructor(
    _intl: MatDatepickerIntl,
    calendar: MatCalendar<any>,
    dateAdapter: DateAdapter<any>,
    @Inject(MAT_DATE_FORMATS) _dateFormats: MatDateFormats,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(_intl, calendar, dateAdapter, _dateFormats, changeDetectorRef);
    this.dateAdapter = dateAdapter;
  }

  get periodLabel(): string {
    return this.calendar && this.calendar.activeDate
      ? this.calendar.activeDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
      : 'Sélectionner une date';
  }

  override previousClicked(): void {
    if (this.calendar && this.calendar.activeDate) {
      this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
    }
  }

  override nextClicked(): void {
    if (this.calendar && this.calendar.activeDate) {
      this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
    }
  }
}

@Component({
  selector: 'app-calendar-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    A11yModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MatCalendarHeader, useClass: CustomCalendarHeader },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss']
})
export class CalendarDialogComponent implements OnInit, AfterViewInit {
  prestataireId: string;
  loggedInUserId: string;
  focusedDay: Date;
  selectedDate: Date | null = null;
  reservations: Reservation[] = [];
  reservedDates: Map<string, string> = new Map();
  isLoading: boolean = true;
  hasError: boolean = false;
  minDate: Date = new Date(2020, 0, 1);
  maxDate: Date = new Date(2030, 11, 31);
  isInitialized: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { prestataireId: string; loggedInUserId: string; focusedDay: Date; selectedDate: Date | null },
    private reservationService: ReservationService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.prestataireId = data.prestataireId || '';
    this.loggedInUserId = data.loggedInUserId || '';
    this.focusedDay = data.focusedDay && !isNaN(new Date(data.focusedDay).getTime()) ? new Date(data.focusedDay) : new Date();
    this.selectedDate = data.selectedDate && !isNaN(new Date(data.selectedDate).getTime()) ? new Date(data.selectedDate) : null;
    console.log(`[DEBUG] CalendarDialogComponent: Constructor called with prestataireId=${this.prestataireId}, loggedInUserId=${this.loggedInUserId}, focusedDay=${this.focusedDay.toISOString()}`);
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('fr');
    this.isInitialized = true;
    this.cdr.detectChanges();
    console.log('[DEBUG] CalendarDialogComponent: ngOnInit completed, isInitialized:', this.isInitialized);
  }

  ngAfterViewInit(): void {
    console.log('[DEBUG] CalendarDialogComponent: ngAfterViewInit called');
    setTimeout(() => {
      this.fetchReservations();
    }, 100);
  }

  fetchReservations(): void {
    if (!this.prestataireId) {
      console.error('[ERROR] prestataireId is missing');
      this.isLoading = false;
      this.hasError = true;
      this.snackBar.open('Erreur : ID du prestataire manquant', 'Fermer', {
        duration: 5000,
        panelClass: ['red-snackbar']
      });
      this.cdr.detectChanges();
      return;
    }

    console.log(`[DEBUG] Fetching confirmed reservations for prestataireId: ${this.prestataireId}`);
    this.isLoading = true;
    this.hasError = false;
    this.reservationService.getConfirmedReservations(this.prestataireId).subscribe({
      next: (reservations) => {
        this.reservations = reservations || [];
        // Filter for confirmed reservations
        const confirmedReservations = this.reservations.filter(res => res.status === 'confirmed');
        this.reservedDates = new Map(
          confirmedReservations.map(res => {
            const date = new Date(res.date);
            const dateStr = date.toISOString().split('T')[0];
            console.log(`[DEBUG] Confirmed reservation: Date=${dateStr}, ID=${res.id}, Service=${res.service || 'N/A'}, Status=${res.status}`);
            return [dateStr, 'confirmed'];
          })
        );
        this.isLoading = false;
        console.log(`[DEBUG] Fetched ${confirmedReservations.length} confirmed reservations, Reserved dates:`, Array.from(this.reservedDates.keys()));
        // Force calendar refresh by reassigning dateClass
        this.dateClass = (date: Date): string => {
          const dateStr = date.toISOString().split('T')[0];
          if (date < this.minDate || date > this.maxDate) {
            console.log(`[DEBUG] Date ${dateStr}: disabled-date`);
            return 'disabled-date';
          }
          const hasReservation = this.reservedDates.has(dateStr);
          const className = hasReservation ? 'reserved-date' : 'available-date';
          console.log(`[DEBUG] Date ${dateStr}: ${className}${hasReservation ? ' (confirmed reservation)' : ''}`);
          return className;
        };
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ERROR] Error fetching reservations:', err.message);
        this.isLoading = false;
        this.hasError = true;
        this.snackBar.open(`Échec du chargement des réservations: ${err.message}`, 'Réessayer', {
          duration: 5000,
          panelClass: ['red-snackbar']
        }).onAction().subscribe(() => this.fetchReservations());
        this.cdr.detectChanges();
      }
    });
  }

  dateClass = (date: Date): string => {
    const dateStr = date.toISOString().split('T')[0];
    if (date < this.minDate || date > this.maxDate) {
      console.log(`[DEBUG] Date ${dateStr}: disabled-date`);
      return 'disabled-date';
    }
    const hasReservation = this.reservedDates.has(dateStr);
    const className = hasReservation ? 'reserved-date' : 'available-date';
    console.log(`[DEBUG] Date ${dateStr}: ${className}${hasReservation ? ' (confirmed reservation)' : ''}`);
    return className;
  };

  onDateSelected(date: Date | null): void {
    if (!date || isNaN(date.getTime())) {
      console.log('[DEBUG] Invalid or no date selected');
      this.snackBar.open('Veuillez sélectionner une date valide', 'Fermer', {
        duration: 3000,
        panelClass: ['red-snackbar']
      });
      return;
    }

    this.selectedDate = date;
    const selectedDayStr = date.toISOString().split('T')[0];
    const isOwner = this.prestataireId === this.loggedInUserId;

    console.log(`[DEBUG] Date selected: ${selectedDayStr}, isOwner: ${isOwner}`);

    const dayReservations = this.reservations.filter(res => {
      const resDate = new Date(res.date);
      return resDate.toISOString().split('T')[0] === selectedDayStr;
    });

    this.dialogRef.close();

    if (isOwner) {
      if (dayReservations.length > 0) {
        console.log(`[DEBUG] Navigating to planning-day for prestataire with ${dayReservations.length} reservations`);
        this.router.navigate([`/planning-day/${this.prestataireId}`], {
          queryParams: { loggedInUserId: this.loggedInUserId, date: date.toISOString() },
          state: { selectedDay: date, reservations: dayReservations }
        });
      } else {
        this.snackBar.open('Aucune réservation confirmée pour ce jour', 'Fermer', {
          duration: 3000,
          panelClass: ['amber-snackbar']
        });
      }
    } else {
      console.log(`[DEBUG] Navigating to reserve for client, date: ${selectedDayStr}`);
      this.router.navigate([`/reserve/${this.prestataireId}`], {
        queryParams: { loggedInUserId: this.loggedInUserId, date: date.toISOString() },
        state: { initialDay: date }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
    console.log('[DEBUG] Dialog closed');
  }
}