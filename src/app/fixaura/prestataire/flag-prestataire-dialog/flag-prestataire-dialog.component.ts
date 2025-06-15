import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminService } from '../../services/AdminService.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-flag-prestataire-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './flag-prestataire-dialog.component.html',
  styleUrls: ['./flag-prestataire-dialog.component.scss'],
})
export class FlagPrestataireDialogComponent {
  flagForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FlagPrestataireDialogComponent>,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) {
    this.flagForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  submitFlag(): void {
    if (this.flagForm.valid) {
      const reason = this.flagForm.value.reason;
      this.adminService.flagPrestataire(this.data.userId, reason).subscribe({
        next: () => {
          this.snackBar.open('Prestataire signalé avec succès', 'Close', { duration: 3000 });
          this.dialogRef.close(true); // Close dialog with success
        },
        error: (err: { message: any }) => {
          console.error('Error flagging prestataire:', err);
          this.snackBar.open(`Échec du signalement: ${err.message}`, 'Close', { duration: 5000 });
          this.dialogRef.close(false); // Close dialog with failure
        },
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false); // Close dialog without submitting
  }
}