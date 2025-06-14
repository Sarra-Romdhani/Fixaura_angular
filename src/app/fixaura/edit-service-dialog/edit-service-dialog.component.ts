// import { Component, Inject } from '@angular/core';
// import { Service } from '../../classes/service.model';
// import { ServiceService } from '../../services/service.service';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// import { environment } from '../../environments/environment';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-edit-service-dialog',
//   templateUrl: './edit-service-dialog.component.html',
//   styleUrls: ['./edit-service-dialog.component.css'],
//   standalone: true,
//   imports: [
//     MatFormFieldModule,
//     MatInputModule,
//     MatIconModule,
//     MatButtonModule,
//     MatSnackBarModule,
//     MatDialogModule,
//     FormsModule
//   ]
// })
// export class EditServiceDialogComponent {
//   service: Service;
//   imageFile: File | null = null;
//   previewUrl: string | null = null;
//   baseUrl = environment.baseUrl;
//   isDarkMode = false; // Default to light mode

//   constructor(
//     private serviceService: ServiceService,
//     private snackBar: MatSnackBar,
//     private dialogRef: MatDialogRef<EditServiceDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { service: Service, userId: string }
//   ) {
//     this.service = { ...data.service };
//   }

//   onFileChange(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.imageFile = input.files[0];
//       this.service.image = this.imageFile;
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.previewUrl = reader.result as string;
//       };
//       reader.readAsDataURL(this.imageFile);
//     }
//   }

//   save() {
//     if (!this.service.title || !this.service.description || !this.service.price || !this.service.estimatedDuration) {
//       this.snackBar.open('All fields are required', 'Close', {
//         duration: 3000,
//         panelClass: ['error-snackbar']
//       });
//       return;
//     }

//     this.serviceService.updateService(this.service).subscribe({
//       next: () => {
//         this.snackBar.open('Service updated successfully', 'Close', {
//           duration: 3000,
//           panelClass: ['success-snackbar']
//         });
//         this.dialogRef.close(true);
//       },
//       error: (error) => {
//         this.snackBar.open(`Error updating service: ${error.message}`, 'Close', {
//           duration: 3000,
//           panelClass: ['error-snackbar']
//         });
//       }
//     });
//   }

//   cancel() {
//     this.dialogRef.close();
//   }
// }



































import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../classes/service.model';
import { ServiceService } from '../../services/service.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-service-dialog',
  templateUrl: './edit-service-dialog.component.html',
  styleUrls: ['./edit-service-dialog.component.css'],
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
export class EditServiceDialogComponent {
  service: Service;
  imageFile: File | null = null;
  previewUrl: string | null = null;
  baseUrl = environment.baseUrl;
  isDarkMode: boolean;

  constructor(
    private serviceService: ServiceService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { service: Service, userId: string, isDarkMode: boolean }
  ) {
    this.service = { ...data.service };
    this.isDarkMode = data.isDarkMode;
    if (this.service.photo) {
      this.previewUrl = this.baseUrl + this.service.photo;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  save() {
    if (!this.service.title || !this.service.description || !this.service.price || !this.service.estimatedDuration) {
      this.snackBar.open('All fields are required', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const formData = new FormData();
    formData.append('id', this.service.id);
    formData.append('title', this.service.title);
    formData.append('description', this.service.description);
    formData.append('price', this.service.price.toString());
    formData.append('estimatedDuration', this.service.estimatedDuration.toString());
    formData.append('prestataireId', this.service.prestataireId);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.serviceService.updateServiceWithFormData(formData).subscribe({
      next: () => {
        this.snackBar.open('Service updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      },
      error: (error: { message: any }) => {
        this.snackBar.open(`Error updating service: ${error.message}`, 'Close', {
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







// import { Component, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common'; // Added for ngClass
// import { Service } from '../../classes/service.model';
// import { ServiceService } from '../../services/service.service';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// import { environment } from '../../environments/environment';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-edit-service-dialog',
//   templateUrl: './edit-service-dialog.component.html',
//   styleUrls: ['./edit-service-dialog.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule, // Added for ngClass
//     MatFormFieldModule,
//     MatInputModule,
//     MatIconModule,
//     MatButtonModule,
//     MatSnackBarModule,
//     MatDialogModule,
//     FormsModule
//   ]
// })
// export class EditServiceDialogComponent {
//   service: Service;
//   imageFile: File | null = null;
//   previewUrl: string | null = null;
//   baseUrl = environment.baseUrl;
//   isDarkMode: boolean;

//   constructor(
//     private serviceService: ServiceService,
//     private snackBar: MatSnackBar,
//     private dialogRef: MatDialogRef<EditServiceDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { service: Service, userId: string, isDarkMode: boolean }
//   ) {
//     this.service = { ...data.service };
//     this.isDarkMode = data.isDarkMode;
//     // Initialize previewUrl with existing photo if available
//     if (this.service.photo) {
//       this.previewUrl = this.baseUrl + this.service.photo;
//     }
//   }

//   onFileChange(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.imageFile = input.files[0];
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.previewUrl = reader.result as string;
//       };
//       reader.readAsDataURL(this.imageFile);
//     }
//   }

//   save() {
//     if (!this.service.title || !this.service.description || !this.service.price || !this.service.estimatedDuration) {
//       this.snackBar.open('All fields are required', 'Close', {
//         duration: 3000,
//         panelClass: ['error-snackbar']
//       });
//       return;
//     }

//     // Create a FormData object to handle file upload
//     const formData = new FormData();
//     formData.append('id', this.service.id);
//     formData.append('title', this.service.title);
//     formData.append('description', this.service.description);
//     formData.append('price', this.service.price.toString());
//     formData.append('estimatedDuration', this.service.estimatedDuration.toString());
//     formData.append('prestataireId', this.service.prestataireId);
//     if (this.imageFile) {
//       formData.append('image', this.imageFile);
//     }

//     this.serviceService.updateServiceWithFormData(formData).subscribe({
//       next: () => {
//         this.snackBar.open('Service updated successfully', 'Close', {
//           duration: 3000,
//           panelClass: ['success-snackbar']
//         });
//         this.dialogRef.close(true);
//       },
//       error: (error: { message: any; }) => {
//         this.snackBar.open(`Error updating service: ${error.message}`, 'Close', {
//           duration: 3000,
//           panelClass: ['error-snackbar']
//         });
//       }
//     });
//   }

//   cancel() {
//     this.dialogRef.close();
//   }
// }