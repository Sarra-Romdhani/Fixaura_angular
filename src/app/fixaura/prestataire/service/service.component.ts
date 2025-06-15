
// import { Component, Input, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ServiceService } from '../../services/service.service';
// import { ReservationService } from '../../services/reservation.service';
// import { Service } from '../../classes/service.model';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { EditServiceDialogComponent } from '../edit-service-dialog/edit-service-dialog.component';
// import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
// import { AddServiceComponent } from '../add-service/add-service.component';
// import { ServiceDetailsDialogComponent } from '../service-details-dialog/service-details-dialog.component';
// import { environment } from '../../environments/environment';
// import { MatButtonModule } from '@angular/material/button';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// @Component({
//   selector: 'app-service',
//   templateUrl: './service.component.html',
//   styleUrls: ['./service.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatButtonModule,
//     MatMenuModule,
//     MatProgressSpinnerModule,
//     MatSnackBarModule,
//     MatDialogModule
//   ]
// })
// export class ServiceComponent implements OnInit {
//   @Input() userId: string = '';
//   @Input() loggedInUserId: string = '';
//   @Output() addPressed = new EventEmitter<void>();
//   isOwner: boolean = false;
//   services: Service[] = [];
//   isLoading: boolean = true;
//   baseUrl = environment.baseUrl;
//   isDarkMode: boolean = false;
//   dropdownOpen: { [key: string]: boolean } = {};

//   constructor(
//     private serviceService: ServiceService,
//     private reservationService: ReservationService,
//     private snackBar: MatSnackBar,
//     private dialog: MatDialog
//   ) {}

//   ngOnInit() {
//     this.isOwner = this.userId === this.loggedInUserId;
//     this.fetchServices();
//   }

//   toggleDarkMode() {
//     this.isDarkMode = !this.isDarkMode;
//   }

//   fetchServices() {
//     if (!this.userId) {
//       this.snackBar.open('User ID is not provided', 'Close', {
//         duration: 3000,
//         panelClass: ['error-snackbar']
//       });
//       this.isLoading = false;
//       return;
//     }

//     this.isLoading = true;
//     this.serviceService.getServicesByPrestataire(this.userId).subscribe({
//       next: (services) => {
//         this.services = services;
//         this.services.forEach(service => {
//           if (!(service.id in this.dropdownOpen)) {
//             this.dropdownOpen[service.id] = false;
//           }
//         });
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.snackBar.open(`Error loading services: ${error.message}`, 'Close', {
//           duration: 3000,
//           panelClass: ['error-snackbar']
//         });
//         this.isLoading = false;
//       }
//     });
//   }

//   deleteService(serviceId: string) {
//     this.serviceService.deleteService(serviceId).subscribe({
//       next: () => {
//         this.snackBar.open('Service deleted successfully', 'Close', {
//           duration: 3000,
//           panelClass: ['success-snackbar']
//         });
//         this.fetchServices();
//       },
//       error: (error) => {
//         this.snackBar.open(`Error deleting service: ${error.message}`, 'Close', {
//           duration: 3000,
//           panelClass: ['error-snackbar']
//         });
//       }
//     });
//   }

//   showEditDialog(service: Service) {
//     const dialogRef = this.dialog.open(EditServiceDialogComponent, {
//       width: '500px',
//       data: { service, userId: this.userId }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.fetchServices();
//       }
//     });
//   }

//   showDeleteConfirmation(serviceId: string) {
//     const dialogRef = this.dialog.open(BookingDialogComponent, {
//       width: '400px',
//       data: { isConfirmation: true, serviceId }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result === 'delete') {
//         this.deleteService(serviceId);
//       }
//     });
//   }

//   showServiceDetails(service: Service) {
//     this.dialog.open(ServiceDetailsDialogComponent, {
//       width: '600px',
//       data: { service, baseUrl: this.baseUrl }
//     });
//   }

//   reserveService(serviceId: string) {
//     const service = this.services.find(s => s.id === serviceId);
//     if (!service) {
//       this.snackBar.open('Service not found', 'Close', {
//         duration: 3000,
//         panelClass: ['error-snackbar']
//       });
//       return;
//     }

//     const dialogRef = this.dialog.open(BookingDialogComponent, {
//       width: '400px',
//       data: { isDateTimePicker: true }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result && result.date && result.time) {
//         const [hours, minutes] = result.time.split(':').map(Number);
//         const reservationDateTime = new Date(result.date);
//         reservationDateTime.setHours(hours, minutes, 0, 0);

//         this.reservationService.checkAvailability(service.prestataireId, reservationDateTime).subscribe({
//           next: (isAvailable) => {
//             const reservationData = {
//               id_client: this.loggedInUserId,
//               id_prestataire: service.prestataireId,
//               date: reservationDateTime.toISOString(),
//               location: 'Service Location',
//               status: isAvailable ? 'confirmed' : 'waiting',
//               service: service.title,
//               price: service.price
//             };

//             this.reservationService.createReservation(reservationData).subscribe({
//               next: () => {
//                 this.dialog.open(BookingDialogComponent, {
//                   width: '400px',
//                   data: { isConfirmed: isAvailable }
//                 });
//               },
//               error: (error) => {
//                 this.snackBar.open(`Reservation failed: ${error.message}`, 'Close', {
//                   duration: 3000,
//                   panelClass: ['error-snackbar']
//                 });
//               }
//             });
//           },
//           error: (error) => {
//             this.snackBar.open(`Error checking availability: ${error.message}`, 'Close', {
//               duration: 3000,
//               panelClass: ['error-snackbar']
//             });
//           }
//         });
//       }
//     });
//   }

//   handleImageError(event: Event) {
//     const img = event.target as HTMLImageElement;
//     img.style.display = 'none';
//     const icon = img.nextElementSibling as HTMLElement;
//     if (icon) {
//       icon.style.display = 'block';
//     }
//   }

//   toggleDropdown(serviceId: string) {
//     this.dropdownOpen[serviceId] = !this.dropdownOpen[serviceId];
//     Object.keys(this.dropdownOpen).forEach(id => {
//       if (id !== serviceId) {
//         this.dropdownOpen[id] = false;
//       }
//     });
//   }

//   closeDropdown(serviceId: string) {
//     this.dropdownOpen[serviceId] = false;
//   }

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent) {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.dropdown')) {
//       Object.keys(this.dropdownOpen).forEach(id => {
//         this.dropdownOpen[id] = false;
//       });
//     }
//   }

//   onAddPressed() {
//     this.addPressed.emit();
//   }
// }


import { Component, Input, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../services/service.service';
import { ReservationService } from '../../services/reservation.service';
import { Service } from '../../classes/service.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditServiceDialogComponent } from '../edit-service-dialog/edit-service-dialog.component';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { AddServiceComponent } from '../add-service/add-service.component';
import { ServiceDetailsDialogComponent } from '../service-details-dialog/service-details-dialog.component';
import { environment } from '../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class ServiceComponent implements OnInit {
  @Input() userId: string = '';
  @Input() loggedInUserId: string = '';
  @Output() addPressed = new EventEmitter<void>();
  isOwner: boolean = false;
  services: Service[] = [];
  isLoading: boolean = true;
  baseUrl = environment.baseUrl;
  isDarkMode: boolean = false;
  dropdownOpen: { [key: string]: boolean } = {};

  constructor(
    private serviceService: ServiceService,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isOwner = this.userId === this.loggedInUserId;
    this.fetchServices();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  fetchServices() {
    if (!this.userId) {
      this.snackBar.open('User ID is not provided', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.serviceService.getServicesByPrestataire(this.userId).subscribe({
      next: (services) => {
        this.services = services;
        this.services.forEach(service => {
          if (!(service.id in this.dropdownOpen)) {
            this.dropdownOpen[service.id] = false;
          }
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open(`Error loading services: ${error.message}`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  deleteService(serviceId: string) {
    this.serviceService.deleteService(serviceId).subscribe({
      next: () => {
        this.snackBar.open('Service deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.fetchServices();
      },
      error: (error) => {
        this.snackBar.open(`Error deleting service: ${error.message}`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  showEditDialog(service: Service) {
    const dialogRef = this.dialog.open(EditServiceDialogComponent, {
      width: '500px',
      data: { service, userId: this.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchServices();
      }
    });
  }

  showDeleteConfirmation(serviceId: string) {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '400px',
      data: { isConfirmation: true, serviceId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteService(serviceId);
      }
    });
  }

  showServiceDetails(service: Service) {
    this.dialog.open(ServiceDetailsDialogComponent, {
      width: '600px',
      data: { service, baseUrl: this.baseUrl }
    });
  }

  reserveService(serviceId: string) {
    const service = this.services.find(s => s.id === serviceId);
    if (!service) {
      this.snackBar.open('Service not found', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '400px',
      data: { isDateTimePicker: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.date && result.time) {
        const [hours, minutes] = result.time.split(':').map(Number);
        const reservationDateTime = new Date(result.date);
        reservationDateTime.setHours(hours, minutes, 0, 0);

        this.reservationService.checkAvailability(service.prestataireId, reservationDateTime).subscribe({
          next: (isAvailable) => {
            const reservationData = {
              id_client: this.loggedInUserId,
              id_prestataire: service.prestataireId,
              date: reservationDateTime.toISOString(),
              location: 'Service Location',
              status: isAvailable ? 'confirmed' : 'waiting',
              service: service.title,
              price: service.price
            };

            this.reservationService.createReservation(reservationData).subscribe({
              next: () => {
                this.dialog.open(BookingDialogComponent, {
                  width: '400px',
                  data: { isConfirmed: isAvailable }
                });
              },
              error: (error) => {
                this.snackBar.open(`Reservation failed: ${error.message}`, 'Close', {
                  duration: 3000,
                  panelClass: ['error-snackbar']
                });
              }
            });
          },
          error: (error) => {
            this.snackBar.open(`Error checking availability: ${error.message}`, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const icon = img.nextElementSibling as HTMLElement;
    if (icon) {
      icon.style.display = 'block';
    }
  }

  toggleDropdown(serviceId: string) {
    this.dropdownOpen[serviceId] = !this.dropdownOpen[serviceId];
    Object.keys(this.dropdownOpen).forEach(id => {
      if (id !== serviceId) {
        this.dropdownOpen[id] = false;
      }
    });
  }

  closeDropdown(serviceId: string) {
    this.dropdownOpen[serviceId] = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      Object.keys(this.dropdownOpen).forEach(id => {
        this.dropdownOpen[id] = false;
      });
    }
  }

  onAddPressed() {
    const dialogRef = this.dialog.open(AddServiceComponent, {
      width: '500px',
      data: { userId: this.userId, isDarkMode: this.isDarkMode }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.fetchServices();
      }
    });
  }
  
}