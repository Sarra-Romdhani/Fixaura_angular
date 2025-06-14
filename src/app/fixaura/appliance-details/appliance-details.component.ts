import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { Appliance } from '../../classes/appliance.model';
import { ApplianceService } from '../../services/appliance.service';

@Component({
  selector: 'app-appliance-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './appliance-details.component.html',
  styleUrls: ['./appliance-details.component.css'],
  providers: [DatePipe]
})
export class ApplianceDetailsComponent implements OnInit {
  appliance: Appliance | null = null;
  history: any[] = [];
  isLoading = false;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applianceService: ApplianceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    const id = this.route.snapshot.paramMap.get('id');
    if (this.userId && id) {
      this.fetchApplianceDetails(id);
      this.fetchHistory(id);
    } else {
      this.showError('User ID or Appliance ID is required');
    }
  }

  fetchApplianceDetails(id: string): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.applianceService.getAppliances(this.userId).subscribe({
      next: (appliances) => {
        this.appliance = appliances.find(a => a._id === id) || null;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.message);
        this.isLoading = false;
      }
    });
  }

  fetchHistory(applianceId: string): void {
    this.isLoading = true;
    this.applianceService.getApplianceHistory(applianceId).subscribe({
      next: (history) => {
        this.history = history;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.message);
        this.isLoading = false;
      }
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return this.datePipe.transform(date, 'yyyy-MM-dd') || 'N/A';
  }

  showError(message: string): void {
    alert(message); // Placeholder
  }

  navigateBack(): void {
    if (this.userId) {
      this.router.navigate([`/appliances/${this.userId}`]);
    }
  }

  isLast(index: number): boolean {
    return index === this.history.length - 1;
  }
}