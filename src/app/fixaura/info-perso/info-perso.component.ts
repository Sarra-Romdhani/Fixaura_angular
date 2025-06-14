import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Prestataire } from '../../classes/prestataire.model';
import { PrestataireService } from '../../services/prestataire.service';

@Component({
  selector: 'app-info-perso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './info-perso.component.html',
  styleUrls: ['./info-perso.component.css']
})
export class InfoPersoComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  prestataire: Prestataire | null = null;
  isLoading = true;
  isSubmitting = false;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  private destroy$ = new Subject<void>();
  private userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private prestataireService: PrestataireService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Get userId from route params
    this.userId = this.route.snapshot.paramMap.get('userId');
    console.log('User ID from route:', this.userId);

    if (!this.userId) {
      this.showError('User ID is required');
      this.router.navigate(['/profile', 'default-user-id']); // Fallback userId
      return;
    }

    this.fetchProfileData();
  }

  navigateBack(): void {
this.router.navigate([`profile/${this.userId}`]);
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      job: ['', Validators.required],
      phoneNumber: [''],
      businessAddress: ['', Validators.required],
      facebook: [''],
      instagram: [''],
      website: ['']
    });
  }

  private fetchProfileData(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.prestataireService.fetchPrestataire(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prestataire: any) => {
          console.log('Profile data fetched:', prestataire);
          this.prestataire = prestataire;
          this.patchFormValues();
          this.isLoading = false;
        },
        error: (error: { message: any; }) => {
          console.error('Error fetching profile:', error);
          this.showError(`Error fetching profile: ${error.message}`);
          this.isLoading = false;
          this.router.navigate(['/profile', this.userId]);
        }
      });
  }

  private patchFormValues(): void {
    if (this.prestataire) {
      this.profileForm.patchValue({
        name: this.prestataire.name,
        job: this.prestataire.job,
        phoneNumber: this.prestataire.phoneNumber,
        businessAddress: this.prestataire.businessAddress,
        facebook: this.prestataire.facebook,
        instagram: this.prestataire.instagram,
        website: this.prestataire.website
      });
      if (this.prestataire.image) {
        this.imagePreview = `${environment.baseUrl}${this.prestataire.image}?v=${Date.now()}`;
      }
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (!this.userId) {
      this.showError('User ID is required');
      return;
    }

    this.isSubmitting = true;
    const formData: Partial<Prestataire> = this.profileForm.value;

    this.prestataireService.updatePrestataire(this.userId, formData, this.imageFile || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/profile', this.userId]);
        },
        error: (error: { message: any; }) => {
          this.showError(`Error updating profile: ${error.message}`);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}