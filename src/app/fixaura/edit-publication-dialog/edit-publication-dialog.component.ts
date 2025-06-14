// import { Component, ViewChild, ElementRef, EventEmitter, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormGroup } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { Publication } from '../../classes/publication.model';

// import { ViewChild, ElementRef, Inject, Component } from "@angular/core";
// import { FormGroup, ReactiveFormsModule } from "@angular/forms";
// import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
// import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
// import { Publication } from "../../classes/publication.model";
// import { CommonModule } from "@angular/common";
// import { MatButtonModule } from "@angular/material/button";
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatInputModule } from "@angular/material/input";

// @Component({
//   selector: 'app-edit-publication-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatButtonModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule
//   ],
//   templateUrl: './edit-publication-dialog.component.html',
//   styleUrls: ['./edit-publication-dialog.component.css']
// })
// export class EditPublicationDialogComponent {
//   save = new EventEmitter<any>();
//   imagePreview: string | null;

//   @ViewChild('fileInput') fileInput!: ElementRef;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: { publication: Publication | null, form: FormGroup, imagePreview: string | null },
//     public dialogRef: MatDialogRef<EditPublicationDialogComponent>
//   ) {
//     this.imagePreview = data.imagePreview;
//   }

//   triggerFileInput() {
//     this.fileInput.nativeElement.click();
//   }

//   onImageSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.imagePreview = URL.createObjectURL(file);
//       this.data.form.patchValue({ image: file });
//     }
//   }

//   handleImageError(event: any) {
//     event.target.style.display = 'none';
//   }
// }














































// import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormGroup } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
// import { Publication } from '../../classes/publication.model';

// @Component({
//   selector: 'app-edit-publication-dialog',
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
//   templateUrl: './edit-publication-dialog.component.html',
//   styleUrls: ['./edit-publication-dialog.component.css']
// })
// export class EditPublicationDialogComponent {
//   imagePreviews: string[] = [];
//   @ViewChild('fileInput') fileInput!: ElementRef;
//   existingImages: string[] = [];

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: { publication: Publication, form: FormGroup, imagePreviews: string[] },
//     public dialogRef: MatDialogRef<EditPublicationDialogComponent>,
//     private snackBar: MatSnackBar
//   ) {
//     // Initialize existingImages with publication's imageUrls
//     this.existingImages = data.publication.imageUrls?.map(url => url) || [];
//     // Initialize imagePreviews with provided previews or publication imageUrls
//     this.imagePreviews = data.imagePreviews?.length > 0 ? data.imagePreviews : this.existingImages;
//   }

//   triggerFileInput() {
//     this.fileInput.nativeElement.click();
//   }

//   onImageSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     const files = Array.from(input.files || []) as File[];
//     const totalImages = files.length + this.imagePreviews.length;
//     if (totalImages > 10) {
//       this.snackBar.open('Maximum 10 images allowed', 'Close', {
//         duration: 3000,
//         panelClass: ['red-snackbar']
//       });
//       return;
//     }
//     if (files.some(file => !file.type.match(/image\/(jpg|jpeg|png)/))) {
//       this.snackBar.open('Only JPG, JPEG, or PNG images are allowed', 'Close', {
//         duration: 3000,
//         panelClass: ['red-snackbar']
//       });
//       return;
//     }
//     if (files.some(file => file.size > 5 * 1024 * 1024)) {
//       this.snackBar.open('Image size must be less than 5MB', 'Close', {
//         duration: 3000,
//         panelClass: ['red-snackbar']
//       });
//       return;
//     }
//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     this.imagePreviews = [...this.imagePreviews, ...newPreviews];
//     const existingFiles = this.data.form.get('images')?.value as File[] | null || [];
//     this.data.form.patchValue({ images: [...existingFiles, ...files] });
//     this.data.form.get('images')?.updateValueAndValidity();
//   }

//   removeImage(index: number) {
//     const removedPreview = this.imagePreviews[index];
//     this.imagePreviews.splice(index, 1);
//     // If the removed image was an existing one, remove it from existingImages
//     if (this.existingImages.includes(removedPreview)) {
//       this.existingImages = this.existingImages.filter(url => url !== removedPreview);
//     }
//     // Update form images (remove corresponding file if it was a new one)
//     const images = this.data.form.get('images')?.value as File[] | null;
//     if (images) {
//       const newImages = images.filter((_, i) => 
//         !this.imagePreviews[i]?.startsWith('blob:') || this.imagePreviews.includes(this.imagePreviews[i])
//       );
//       this.data.form.patchValue({ images: newImages.length > 0 ? newImages : null });
//       this.data.form.get('images')?.updateValueAndValidity();
//     }
//   }

//   handleImageError(event: Event, index: number) {
//     const removedPreview = this.imagePreviews[index];
//     this.imagePreviews.splice(index, 1);
//     this.existingImages = this.existingImages.filter(url => url !== removedPreview);
//     const images = this.data.form.get('images')?.value as File[] | null;
//     if (images) {
//       const newImages = images.filter((_, i) => 
//         !this.imagePreviews[i]?.startsWith('blob:') || this.imagePreviews.includes(this.imagePreviews[i])
//       );
//       this.data.form.patchValue({ images: newImages.length > 0 ? newImages : null });
//     }
//   }

//   savePublication() {
//     if (this.data.form.valid) {
//       const formValue = {
//         ...this.data.form.value,
//         existingImages: this.existingImages
//       };
//       console.log('[Debug] EditPublicationDialog Form Value:', formValue);
//       this.dialogRef.close({ success: true, formValue });
//     } else {
//       console.log('[Debug] EditPublicationDialog Form Errors:', {
//         formErrors: this.data.form.errors,
//         titleErrors: this.data.form.get('title')?.errors,
//         descriptionErrors: this.data.form.get('description')?.errors,
//         imagesErrors: this.data.form.get('images')?.errors
//       });
//       this.snackBar.open('Please fill in all required fields', 'Close', {
//         duration: 3000,
//         panelClass: ['red-snackbar']
//       });
//     }
//   }
// }

// src/app/fixaura/edit-publication-dialog/edit-publication-dialog.component.ts
import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Publication } from '../../classes/publication.model';

@Component({
  selector: 'app-edit-publication-dialog',
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
  templateUrl: './edit-publication-dialog.component.html',
  styleUrls: ['./edit-publication-dialog.component.css']
})
export class EditPublicationDialogComponent {
  imagePreviews: string[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  existingImages: string[] = [];
  newImageFiles: File[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { publication: Publication, form: FormGroup, imagePreviews: string[] },
    public dialogRef: MatDialogRef<EditPublicationDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    // Initialize existingImages with normalized URLs from publication
    this.existingImages = data.publication.imageUrls?.map(url => url) || [];
    // Initialize imagePreviews with provided previews or existingImages
    this.imagePreviews = data.imagePreviews?.length > 0 ? data.imagePreviews : [...this.existingImages];
    this.newImageFiles = [];
    // Initialize form's images control as empty array
    this.data.form.patchValue({ images: [] });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []) as File[];
    const totalImages = files.length + this.imagePreviews.length;

    if (totalImages > 10) {
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

    // Add new files and their previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    this.imagePreviews = [...this.imagePreviews, ...newPreviews];
    this.newImageFiles = [...this.newImageFiles, ...files];
    this.data.form.patchValue({ images: this.newImageFiles });
    this.data.form.get('images')?.updateValueAndValidity();
  }

  removeImage(index: number) {
    const removedPreview = this.imagePreviews[index];
    this.imagePreviews.splice(index, 1);

    // Check if the removed image is an existing one (server URL)
    const existingImageIndex = this.existingImages.indexOf(removedPreview);
    if (existingImageIndex !== -1) {
      // Remove from existingImages to mark for deletion on the server
      this.existingImages.splice(existingImageIndex, 1);
    } else {
      // Remove from newImageFiles if it was a newly added image (blob URL)
      const fileIndex = this.newImageFiles.findIndex((_, i) => URL.createObjectURL(this.newImageFiles[i]) === removedPreview);
      if (fileIndex !== -1) {
        this.newImageFiles.splice(fileIndex, 1);
      }
    }

    // Update form's images control with remaining new files
    this.data.form.patchValue({ images: this.newImageFiles.length > 0 ? this.newImageFiles : null });
    this.data.form.get('images')?.updateValueAndValidity();
  }

  handleImageError(event: Event, index: number) {
    this.snackBar.open('Failed to load image', 'Close', {
      duration: 3000,
      panelClass: ['red-snackbar']
    });
    this.removeImage(index);
  }

  savePublication() {
    if (this.data.form.valid) {
      const formValue = {
        title: this.data.form.get('title')?.value,
        description: this.data.form.get('description')?.value,
        images: this.newImageFiles.length > 0 ? this.newImageFiles : null,
        existingImages: this.existingImages
      };
      console.log('[Debug] EditPublicationDialog Form Value:', formValue);
      this.dialogRef.close({ success: true, formValue });
    } else {
      console.log('[Debug] EditPublicationDialog Form Errors:', {
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