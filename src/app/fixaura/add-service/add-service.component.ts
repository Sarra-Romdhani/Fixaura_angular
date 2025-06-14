import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../classes/service.model';
import { ServiceService } from '../../services/service.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule
  ]
})
export class AddServiceComponent {
  service: Service = {
    id: '',
    title: '',
    description: '',
    price: 0,
    estimatedDuration: 0,
    prestataireId: ''
  };
  imageFile: File | null = null;
  previewUrl: string | null = null;
  isDarkMode: boolean;

  constructor(
    private serviceService: ServiceService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string, isDarkMode: boolean }
  ) {
    this.service.prestataireId = data.userId;
    this.isDarkMode = data.isDarkMode;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      this.service.image = this.imageFile;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  save() {
    if (!this.service.title || !this.service.description || !this.service.price || !this.service.estimatedDuration || !this.imageFile) {
      this.snackBar.open('All fields are required', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.serviceService.createService(this.service).subscribe({
      next: () => {
        this.snackBar.open('Service created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(`Error creating service: ${error.message}`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}