// import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
// import { Publication } from '../../classes/publication.model';
// import { PublicationService } from '../../services/publication.service';

// @Component({
//   selector: 'app-add-publication-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatButtonModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSnackBarModule
//   ],
//   templateUrl: './add-publication-dialog.component.html',
//   styleUrls: ['./add-publication-dialog.component.css']
// })
// export class AddPublicationDialogComponent {
//   imagePreview: string | null;

//   @ViewChild('fileInput') fileInput!: ElementRef;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup; imagePreview?: string | null; providerId?: string; userId?: string; loggedInUserId?: string },
//     public dialogRef: MatDialogRef<AddPublicationDialogComponent>,
//     private snackBar: MatSnackBar,
//     private publicationService: PublicationService,
//     private fb: FormBuilder
//   ) {
//     console.log('MAT_DIALOG_DATA:', data); // Debug: Log data
//     this.imagePreview = data.imagePreview || null;
//     if (!data.form) {
//       this.data.form = this.fb.group({
//         title: ['', Validators.required],
//         description: ['', Validators.required],
//         image: [null]
//       });
//     } else if (!data.form.get('image')) {
//       data.form.addControl('image', this.fb.control(null));
//     }
//   }

//   triggerFileInput() {
//     this.fileInput.nativeElement.click();
//   }

//   onImageSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     const file = input.files?.[0];
//     if (file) {
//       if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
//         this.snackBar.open('Only JPG, JPEG, or PNG images are allowed', 'Close', {
//           duration: 3000,
//           panelClass: ['red-snackbar']
//         });
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         this.snackBar.open('Image size must be less than 5MB', 'Close', {
//           duration: 3000,
//           panelClass: ['red-snackbar']
//         });
//         return;
//       }
//       this.imagePreview = URL.createObjectURL(file);
//       this.data.form.patchValue({ image: file });
//       this.data.form.get('image')?.updateValueAndValidity();
//     } else {
//       this.snackBar.open('No image selected', 'Close', {
//         duration: 3000,
//         panelClass: ['red-snackbar']
//       });
//     }
//   }

//   handleImageError(event: Event) {
//     const img = event.target as HTMLImageElement;
//     img.style.display = 'none';
//     this.imagePreview = null;
//     this.data.form.patchValue({ image: null });
//   }

//   savePublication() {
//     const providerId = this.data.providerId || this.data.userId || this.data.loggedInUserId;
//     if (!providerId) {
//       console.error('Provider ID is missing in MAT_DIALOG_DATA:', this.data);
//       this.snackBar.open('Provider ID is missing. Please ensure you are logged in as a prestataire.', 'Close', {
//         duration: 5000,
//         panelClass: ['red-snackbar']
//       });
//       return;
//     }

//     if (this.data.form.valid) {
//       const formValue = this.data.form.value;
//       const publicationData: Partial<Publication> = {
//         title: formValue.title,
//         description: formValue.description,
//         providerId,
//         image: formValue.image,
//         likes: [],
//         comments: [],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };
//       const publication = new Publication(publicationData);
//       this.publicationService.createPublication(publication).subscribe({
//         next: (response) => {
//           console.log('Publication created:', response); // Debug: Log response
//           this.dialogRef.close({ success: true, publication: response }); // Close dialog first
//           this.snackBar.open('Publication created successfully', 'Close', {
//             duration: 3000,
//             panelClass: ['green-snackbar']
//           });
//         },
//         error: (error) => {
//           console.error('Create publication error:', error);
//           this.snackBar.open(error.message || 'Failed to create publication', 'Close', {
//             duration: 3000,
//             panelClass: ['red-snackbar']
//           });
//         }
//       });
//     } else {
//       this.snackBar.open('Please fill in all required fields', 'Close', {
//         duration: 3000,
//         panelClass: ['red-snackbar']
//       });
//     }
//   }
// }
// add-publication-dialog.component.ts
import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-publication-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './add-publication-dialog.component.html',
  styleUrls: ['./add-publication-dialog.component.css']
})
export class AddPublicationDialogComponent {
  imagePreviews: string[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  isDarkMode: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, imagePreviews: string[], userId: string, loggedInUserId: string, isDarkMode: boolean },
    public dialogRef: MatDialogRef<AddPublicationDialogComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.imagePreviews = data.imagePreviews || [];
    this.isDarkMode = data.isDarkMode || false;
    if (!data.form) {
      this.data.form = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(100)]],
        description: ['', [Validators.required, Validators.maxLength(1000)]],
        images: [null]
      });
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []) as File[];
    if (files.length + this.imagePreviews.length > 10) {
      this.snackBar.open('Maximum 10 images allowed', 'Close', {
        duration: 3000,
        panelClass: ['red-snackbar']
      });
      return;
    }
    if (files.some(file => !file.type.match(/image\/(jpg|jpeg|png)/))) {
      this.snackBar.open('Only JPG, JPEG, or PNG images are allowed', 'Close', {
        duration: 3000,
        panelClass: ['red-snackbar']
      });
      return;
    }
    if (files.some(file => file.size > 5 * 1024 * 1024)) {
      this.snackBar.open('Image size must be less than 5MB', 'Close', {
        duration: 3000,
        panelClass: ['red-snackbar']
      });
      return;
    }
    this.imagePreviews = files.map(file => URL.createObjectURL(file));
    this.data.form.patchValue({ images: files });
    this.data.form.get('images')?.updateValueAndValidity();
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    const images = this.data.form.get('images')?.value as File[] | null;
    if (images) {
      images.splice(index, 1);
      this.data.form.patchValue({ images: images.length > 0 ? images : null });
      this.data.form.get('images')?.updateValueAndValidity();
    }
  }

  handleImageError(event: Event, index: number) {
    this.imagePreviews.splice(index, 1);
    const images = this.data.form.get('images')?.value as File[] | null;
    if (images) {
      images.splice(index, 1);
      this.data.form.patchValue({ images: images.length > 0 ? images : null });
    }
  }

  savePublication() {
    if (this.data.form.valid) {
      const formValue = { ...this.data.form.value };
      console.log('[Debug] AddPublicationDialog Form Value:', formValue);
      this.dialogRef.close({ success: true, formValue });
    } else {
      console.log('[Debug] AddPublicationDialog Form Errors:', {
        formErrors: this.data.form.errors,
        titleErrors: this.data.form.get('title')?.errors,
        descriptionErrors: this.data.form.get('description')?.errors,
        imagesErrors: this.data.form.get('images')?.errors
      });
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: ['red-snackbar']
      });
    }
  }
}