import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ApplianceService } from '../../services/appliance.service';

@Component({
  selector: 'app-appliance-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './appliance-update.component.html',
  styleUrls: ['./appliance-update.component.css']
})
export class ApplianceUpdateComponent implements OnInit {
  applianceForm: FormGroup;
  image: File | null = null;
  imagePreview: string | null = null;
  existingImage: string | null = null;
  isLoading = false;
  userId: string | null = null;
  applianceId: string | null = null;
  brands = ['Samsung', 'LG', 'Whirlpool', 'Bosch', 'GE', 'Frigidaire', 'Siemens', 'Haier'];

  constructor(
    private fb: FormBuilder,
    private applianceService: ApplianceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.applianceForm = this.fb.group({
      modele: ['', Validators.required],
      brand: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      breakdownCount: ['', [Validators.required, Validators.min(0)]],
      lastBreakdownDate: [''],
      lastMaintenanceDate: ['']
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.applianceId = this.route.snapshot.paramMap.get('id');
    if (this.userId && this.applianceId) {
      this.applianceService.getAppliances(this.userId).subscribe({
        next: (appliances) => {
          const appliance = appliances.find(a => a._id === this.applianceId);
          if (appliance) {
            this.applianceForm.patchValue({
              modele: appliance.modele,
              brand: appliance.brand,
              purchaseDate: appliance.purchaseDate.split('T')[0],
              breakdownCount: appliance.breakdownCount || 0,
              lastBreakdownDate: appliance.lastBreakdownDate ? appliance.lastBreakdownDate.split('T')[0] : '',
              lastMaintenanceDate: appliance.lastMaintenanceDate ? appliance.lastMaintenanceDate.split('T')[0] : ''
            });
            this.existingImage = appliance.image || null;
            this.imagePreview = appliance.image ? 'data:image/jpeg;base64,' + appliance.image : null;
          }
        },
        error: (error) => this.showError(error.message)
      });
    } else {
      this.showError('User ID or Appliance ID is required');
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.image = input.files[0];
      this.existingImage = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.image);
    } else {
      this.image = null;
      this.imagePreview = this.existingImage ? 'data:image/jpeg;base64,' + this.existingImage : null;
    }
  }

  async submitForm(): Promise<void> {
    if (this.applianceForm.invalid || !this.applianceId || !this.userId) return;

    this.isLoading = true;
    let imageBase64: string | undefined = this.existingImage || undefined;
    if (this.image) {
      imageBase64 = await this.fileToBase64(this.image);
    }

    const applianceData = {
      userId: this.userId,
      modele: this.applianceForm.value.modele,
      brand: this.applianceForm.value.brand,
      purchaseDate: this.applianceForm.value.purchaseDate,
      breakdownCount: parseInt(this.applianceForm.value.breakdownCount, 10),
      lastBreakdownDate: this.applianceForm.value.lastBreakdownDate || undefined,
      lastMaintenanceDate: this.applianceForm.value.lastMaintenanceDate || undefined,
      image: imageBase64,
      usageFrequency: 'daily',
      hasBrokenDown: this.applianceForm.value.breakdownCount > 0
    };

    this.applianceService.updateAppliance(this.applianceId, applianceData).subscribe({
      next: () => {
        this.applianceService.predictBreakdown(applianceData).subscribe({
          next: () => {
            this.showSuccess('Appareil mis à jour et analysé avec succès');
            this.router.navigate([`/appliances/${this.userId}`]);
          },
          error: (error) => {
            this.showError(error.message);
            this.router.navigate([`/appliances/${this.userId}`]);
          }
        });
      },
      error: (error) => {
        this.showError(error.message);
        this.isLoading = false;
      }
    });
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }

  showError(message: string): void {
    // Implement toast notification (e.g., using MatSnackBar)
    alert(message); // Placeholder
  }

  showSuccess(message: string): void {
    // Implement toast notification
    alert(message); // Placeholder
  }

  navigateBack(): void {
    if (this.userId) {
      this.router.navigate([`/appliances/${this.userId}`]);
    }
  }
}