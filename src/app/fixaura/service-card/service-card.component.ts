import { Component, Input, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../classes/service.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { environment } from '../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  standalone: true,
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class ServiceComponent implements OnInit {
  @Input() userId!: string;
  @Input() loggedInUserId!: string;
  @Input() onAddPressed!: () => void;

  isOwner = false;
  services: Service[] = [];
  isLoading = true;
  baseUrl = environment.baseUrl;
  isDarkMode = false; // Default to light mode

  constructor(
    private serviceService: ServiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isOwner = this.userId === this.loggedInUserId;
    this.fetchServices();
  }

  fetchServices() {
    this.isLoading = true;
    this.serviceService.getServicesByPrestataire(this.userId).subscribe({
      next: (services) => {
        console.log('Fetch completed. Services count:', services.length);
        this.services = services;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Fetch error:', error);
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
    const dialogRef = this.dialog.open(ServiceComponent, {
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

  reserveService(serviceId: string) {
    this.snackBar.open('Reservation functionality to be implemented', 'Close', {
      duration: 3000
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
}