// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ReservationService } from '../../services/reservation.service';
// import { CommonModule } from '@angular/common';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSelectModule } from '@angular/material/select';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// @Component({
//   selector: 'app-reserve',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatToolbarModule,
//     MatIconModule,
//     MatSelectModule,
//     MatProgressSpinnerModule
//   ],
//   templateUrl: './reserve.component.html',
//   styleUrls: ['./reserve.component.scss']
// })
// export class ReserveComponent implements OnInit {
//   reservationForm: FormGroup;
//   prestataireId: string = '';
//   loggedInUserId: string = '';
//   initialDay: Date = new Date();
//   isLoading: boolean = false;
//   minDate: Date = new Date();
//   maxDate: Date = new Date(2030, 11, 31);

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private reservationService: ReservationService,
//     private snackBar: MatSnackBar,
//     private dateAdapter: DateAdapter<Date>
//   ) {
//     this.reservationForm = this.fb.group({
//       date: ['', Validators.required],
//       time: ['', Validators.required],
//       service: ['', Validators.required],
//       request: ['', Validators.required],
//       price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
//     });
//     this.dateAdapter.setLocale('fr');
//   }

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.prestataireId = params['prestataireId'] || this.route.snapshot.paramMap.get('prestataireId') || '';
//       // Handle both loggedInUserId and loggedId
//       this.loggedInUserId = params['loggedInUserId'] || params['loggedId'] || '';
//       const dateParam = params['date'];
//       if (dateParam) {
//         this.initialDay = new Date(dateParam);
//         this.reservationForm.patchValue({ date: this.initialDay });
//       }
//       console.log(`[DEBUG] ReserveComponent: prestataireId=${this.prestataireId}, loggedInUserId=${this.loggedInUserId}, initialDay=${this.initialDay}`);
//     });

//     // Check if user is logged in
//     const token = localStorage.getItem('token'); // Adjust based on your auth mechanism
//     if (!token || !this.isValidId(this.loggedInUserId)) {
//       this.snackBar.open('Vous devez être connecté pour réserver', 'Fermer', {
//         duration: 5000,
//         panelClass: ['red-snackbar']
//       });
//       this.router.navigate(['/login']);
//       return;
//     }

//     const now = new Date();
//     const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
//     this.reservationForm.patchValue({ time: timeStr });
//   }

//   async submitReservation(): Promise<void> {
//     if (this.reservationForm.invalid) {
//       this.reservationForm.markAllAsTouched();
//       this.snackBar.open('Veuillez remplir tous les champs correctement', 'Fermer', {
//         duration: 5000,
//         panelClass: ['red-snackbar']
//       });
//       return;
//     }

//     if (this.prestataireId === this.loggedInUserId) {
//       this.snackBar.open('Un prestataire ne peut pas réserver ses propres services', 'Fermer', {
//         duration: 5000,
//         panelClass: ['red-snackbar']
//       });
//       return;
//     }

//     if (!this.isValidId(this.prestataireId) || !this.isValidId(this.loggedInUserId)) {
//       this.snackBar.open('Erreur technique: Identifiants invalides', 'Fermer', {
//         duration: 5000,
//         panelClass: ['red-snackbar']
//       });
//       return;
//     }

//     this.isLoading = true;
//     try {
//       const formValue = this.reservationForm.value;
//       const [hours, minutes] = formValue.time.split(':').map(Number);
//       const reservationDateTime = new Date(formValue.date);
//       reservationDateTime.setHours(hours, minutes, 0, 0);

//       const isAvailable = await this.reservationService.checkAvailability(this.prestataireId, reservationDateTime).toPromise();

//       const reservationData = {
//         id_client: this.loggedInUserId,
//         id_prestataire: this.prestataireId,
//         date: reservationDateTime.toISOString(),
//         status: isAvailable ? 'pending' : 'waiting',
//         location: 'no location',
//         service: formValue.service,
//         price: parseFloat(formValue.price),
//         request: formValue.request
//       };

//       const response = await this.reservationService.createReservation(reservationData).toPromise();

//       this.snackBar.open(
//         isAvailable ? 'Réservation enregistrée avec succès' : 'Créneau en conflit (±1h avant/2h après) - Vous êtes sur la liste d\'attente',
//         'Fermer',
//         {
//           duration: 5000,
//           panelClass: isAvailable ? ['green-snackbar'] : ['amber-snackbar']
//         }
//       );

//       // Navigate back to the prestataire's profile
//       this.router.navigate([`/profile/${this.prestataireId}`], {
//         queryParams: { loggedId: this.loggedInUserId },
//         state: { reservationSuccess: true }
//       });
//     } catch (error: any) {
//       console.error('[ERROR] Error creating reservation:', JSON.stringify(error, null, 2));
//       const errorMessage = error.message || (error.error && error.error.message) || 'Erreur inconnue';
//       if (error.status === 401 || error.status === 403) {
//         this.snackBar.open('Session expirée. Veuillez vous reconnecter.', 'Fermer', {
//           duration: 5000,
//           panelClass: ['red-snackbar']
//         });
//         localStorage.removeItem('token');
//         localStorage.removeItem('loggedInUserId');
//         this.router.navigate(['/login']);
//         return;
//       }
//       this.snackBar.open(`Erreur: ${errorMessage}`, 'Fermer', {
//         duration: 5000,
//         panelClass: ['red-snackbar']
//       });
//       // Navigate back to profile even on error
//       this.router.navigate([`/profile/${this.prestataireId}`], {
//         queryParams: { loggedId: this.loggedInUserId }
//       });
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   goBack(): void {
//     // Navigate back to the prestataire's profile
//     this.router.navigate([`/profile/${this.prestataireId}`], {
//       queryParams: { loggedId: this.loggedInUserId }
//     });
//   }

//   isValidId(id: string): boolean {
//     return id.length === 24 && /^[a-f\d]{24}$/.test(id);
//   }

//   formatTime(time: string): string {
//     if (!time) return '';
//     const [hours, minutes] = time.split(':');
//     return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss']
})
export class ReserveComponent implements OnInit {
  reservationForm: FormGroup;
  prestataireId: string = '';
  loggedInUserId: string = '';
  initialDay: Date = new Date();
  isLoading: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = new Date(2030, 11, 31);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.reservationForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      service: ['', Validators.required],
      request: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
    this.dateAdapter.setLocale('fr');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.prestataireId = params['prestataireId'] || this.route.snapshot.paramMap.get('prestataireId') || '';
      this.loggedInUserId = params['loggedInUserId'] || params['loggedId'] || '';
      const dateParam = params['date'];
      if (dateParam) {
        this.initialDay = new Date(dateParam);
        this.reservationForm.patchValue({ date: this.initialDay });
      }
      console.log(`[DEBUG] ReserveComponent: prestataireId=${this.prestataireId}, loggedInUserId=${this.loggedInUserId}, initialDay=${this.initialDay}`);
    });

    const token = localStorage.getItem('token');
    if (!token || !this.isValidId(this.loggedInUserId)) {
      console.log('[DEBUG] User not logged in, opening dialog');
      this.openDialog('Vous devez être connecté pour réserver', true, undefined, () => {
        this.router.navigate(['/login']);
      });
      return;
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.reservationForm.patchValue({ time: timeStr });
  }

  async submitReservation(): Promise<void> {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      console.log('[DEBUG] Invalid form, opening dialog');
      this.openDialog('Veuillez remplir tous les champs correctement', true);
      return;
    }

    if (this.prestataireId === this.loggedInUserId) {
      console.log('[DEBUG] Same prestataire and user ID, opening dialog');
      this.openDialog('Un prestataire ne peut pas réserver ses propres services', true);
      return;
    }

    if (!this.isValidId(this.prestataireId) || !this.isValidId(this.loggedInUserId)) {
      console.log('[DEBUG] Invalid IDs, opening dialog');
      this.openDialog('Erreur technique: Identifiants invalides', true);
      return;
    }

    this.isLoading = true;
    try {
      const formValue = this.reservationForm.value;
      const [hours, minutes] = formValue.time.split(':').map(Number);
      const reservationDateTime = new Date(formValue.date);
      reservationDateTime.setHours(hours, minutes, 0, 0);

      const reservationData = {
        id_client: this.loggedInUserId,
        id_prestataire: this.prestataireId,
        date: reservationDateTime.toISOString(),
        location: 'no location',
        service: formValue.service,
        price: parseFloat(formValue.price),
        request: formValue.request
      };

      console.log('[DEBUG] Creating reservation with data:', reservationData);
      const response = await this.reservationService.createReservation(reservationData).toPromise();

      const reservation = response.data;
      const message = reservation.status === 'waiting'
        ? 'Créneau en conflit (±1h avant/2h après) - Vous êtes sur la liste d\'attente'
        : 'Réservation enregistrée avec succès';
      console.log('[DEBUG] Opening success/waiting dialog with message:', message, 'reservationId:', reservation._id);
      this.openDialog(message, false, reservation._id, () => {
        console.log('[DEBUG] Dialog closed, navigating to profile');
        this.router.navigate([`/profile/${this.prestataireId}`], {
          queryParams: { loggedId: this.loggedInUserId },
          state: { reservationSuccess: true }
        });
      });
    } catch (error: any) {
      console.error('[ERROR] Error creating reservation:', error);
      const errorMessage = error.message || (error.error && error.error.message) || 'Erreur inconnue';
      if (error.status === 401 || error.status === 403) {
        console.log('[DEBUG] Unauthorized, opening dialog');
        this.openDialog('Session expirée. Veuillez vous reconnecter.', true, undefined, () => {
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInUserId');
          this.router.navigate(['/login']);
        });
        return;
      }
      console.log('[DEBUG] Opening error dialog with message:', errorMessage);
      this.openDialog(`Erreur: ${errorMessage}`, true, undefined, () => {
        console.log('[DEBUG] Error dialog closed, navigating to profile');
        this.router.navigate([`/profile/${this.prestataireId}`], {
          queryParams: { loggedId: this.loggedInUserId }
        });
      });
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void {
    console.log('[DEBUG] Navigating back to profile');
    this.router.navigate([`/profile/${this.prestataireId}`], {
      queryParams: { loggedId: this.loggedInUserId }
    });
  }

  isValidId(id: string): boolean {
    return id.length === 24 && /^[a-f\d]{24}$/.test(id);
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  private openDialog(message: string, isError: boolean, reservationId?: string, afterClose?: () => void): void {
    console.log('[DEBUG] Opening dialog with message:', message, 'isError:', isError, 'reservationId:', reservationId);
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      data: { message, isError, reservationId },
      disableClose: true,
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('[DEBUG] Dialog closed');
      if (afterClose) {
        afterClose();
      }
    });
  }
}