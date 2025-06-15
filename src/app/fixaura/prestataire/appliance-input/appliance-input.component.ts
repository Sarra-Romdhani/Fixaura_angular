import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplianceService } from '../../services/appliance.service';

@Component({
  selector: 'app-appliance-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './appliance-input.component.html',
  styleUrls: ['./appliance-input.component.css']
})
export class ApplianceInputComponent {
  applianceForm: FormGroup;
  image: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  userId: string | null = null;
  brands = ['Samsung', 'LG', 'Whirlpool', 'Bosch', 'GE', 'Frigidaire', 'Siemens', 'Haier'];

  constructor(
    private fb: FormBuilder,
    private applianceService: ApplianceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.applianceForm = this.fb.group({
      modele: ['', Validators.required],
      brand: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      breakdownCount: ['', [Validators.required, Validators.min(0)]],
      lastBreakdownDate: [''],
      lastMaintenanceDate: ['']
    });
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.image = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.image);
    } else {
      this.image = null;
      this.imagePreview = null;
    }
  }

  async submitForm(): Promise<void> {
    if (this.applianceForm.invalid || !this.userId) return;

    this.isLoading = true;
    let imageBase64: string | undefined;
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

    this.applianceService.addAppliance(applianceData).subscribe({
      next: () => {
        this.applianceService.predictBreakdown(applianceData).subscribe({
          next: () => {
            this.showSuccess('Appareil ajouté et analysé avec succès');
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
    alert(message); // Placeholder
  }

  showSuccess(message: string): void {
    alert(message); // Placeholder
  }

  navigateBack(): void {
    if (this.userId) {
      this.router.navigate([`/appliances/${this.userId}`]);
    }
  }
}