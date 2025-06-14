import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface User {
  name: string;
  phone: string;
  email: string;
  address: string;
  image?: string;
}

@Component({
  selector: 'app-profile-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './profile-edit-dialog.component.html',
  styleUrls: ['./profile-edit-dialog.component.css']
})
export class ProfileEditDialogComponent {
  editForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ProfileEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: [data.name, [Validators.required]],
      phone: [data.phone, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
      address: [data.address, [Validators.required]]
    });
    this.imagePreview = data.image || null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        console.log('Selected file:', this.selectedFile?.name, 'Preview:', this.imagePreview); // Debug log
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedUser: User = {
        name: this.editForm.value.name,
        phone: this.editForm.value.phone,
        email: this.editForm.value.email,
        address: this.editForm.value.address,
        image: this.imagePreview || undefined
      };
      console.log('Submitting form:', updatedUser, 'File:', this.selectedFile?.name); // Debug log
      this.dialogRef.close({ user: updatedUser, file: this.selectedFile });
    } else {
      console.log('Form invalid:', this.editForm.errors); // Debug log
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}