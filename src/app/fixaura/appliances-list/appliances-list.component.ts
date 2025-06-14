import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { Appliance } from '../../classes/appliance.model';
import { ApplianceService } from '../../services/appliance.service';

@Component({
  selector: 'app-appliances-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './appliances-list.component.html',
  styleUrls: ['./appliances-list.component.css'],
  providers: [DatePipe]
})
export class AppliancesListComponent implements OnInit {
  appliances: Appliance[] = [];
  isLoading = false;
  userId: string | null = null;
  showModal = false;
  selectedApplianceId: string | null = null;

  constructor(
    private applianceService: ApplianceService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.fetchAppliances();
    } else {
      this.showError('User ID is required');
    }
  }

  fetchAppliances(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.applianceService.getAppliances(this.userId).subscribe({
      next: (appliances) => {
        this.appliances = appliances;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.message);
        this.isLoading = false;
      }
    });
  }

  openDeleteModal(applianceId: string): void {
    this.selectedApplianceId = applianceId;
    this.showModal = true;
  }

  closeDeleteModal(): void {
    this.showModal = false;
    this.selectedApplianceId = null;
  }

  confirmDelete(): void {
    if (this.selectedApplianceId && this.isValidMongoId(this.selectedApplianceId)) {
      this.deleteAppliance(this.selectedApplianceId);
    }
    this.closeDeleteModal();
  }

  deleteAppliance(id: string): void {
    if (!this.isValidMongoId(id)) {
      this.showError('ID d\'appareil invalide');
      return;
    }
    this.applianceService.deleteAppliance(id).subscribe({
      next: () => {
        this.showSuccess('Appareil supprimé avec succès');
        this.fetchAppliances();
      },
      error: (error) => this.showError(error.message)
    });
  }

  isValidMongoId(id: string): boolean {
    return /^[a-fA-F\d]{24}$/.test(id);
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return this.datePipe.transform(date, 'yyyy-MM-dd') || 'N/A';
  }

  showError(message: string): void {
    alert(message); // Placeholder, consider replacing with a toast
  }

  showSuccess(message: string): void {
    alert(message); // Placeholder, consider replacing with a toast
  }

  navigateToAdd(): void {
    if (this.userId) {
      this.router.navigate([`/appliances/${this.userId}/add`]);
    }
  }

  navigateToDetails(appliance: Appliance): void {
    if (this.userId && appliance._id) {
      this.router.navigate([`/appliances/${this.userId}/details/${appliance._id}`]);
    }
  }

  navigateToUpdate(appliance: Appliance): void {
    if (this.userId && appliance._id) {
      this.router.navigate([`/appliances/${this.userId}/update/${appliance._id}`]);
    }
  }

  navigateToProfile(): void {
    if (this.userId) {
      this.router.navigate([`/profile/${this.userId}`], { queryParams: { loggedId: this.userId } });
    } else {
      this.showError('User ID is required');
    }
  }
}