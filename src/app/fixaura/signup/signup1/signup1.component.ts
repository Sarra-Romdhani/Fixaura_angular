import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-signup1',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
  ],
  templateUrl: './signup1.component.html',
  styleUrl: './signup1.component.css',
})
export class Signup1Component {
  @ViewChild('fileInput') fileInput!: ElementRef;
  prenom: string = '';
  nom: string = '';
  telephone: string = '';
  email: string = '';
  selectedStatus: string = '';
  adresse: string = '';
  imageFile: File | null = null;
  imagePreview: string | null = null; // For displaying the preview

  constructor(private router: Router, private signupService: SignupService) {}

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
    if (this.imageFile) {
      console.log('Selected file:', this.imageFile.name, this.imageFile.type, this.imageFile.size);
      // Generate a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  onNext() {
    if (!this.selectedStatus) {
      console.log('Please select a status (Client or Prestateaire)');
      return;
    }

    const userData = {
      userType: this.selectedStatus,
      name: `${this.prenom} ${this.nom}`,
      email: this.email,
      phoneNumber: this.telephone,
      homeAddress: this.adresse,
      imageFile: this.imageFile, // Store the File object
      imagePreview: this.imagePreview, // Store the preview URL for display in later steps
    };
    this.signupService.setData('step1', userData);

    if (this.selectedStatus === 'client') {
      this.router.navigate(['/final step']);
    } else if (this.selectedStatus === 'prestateaire') {
      this.router.navigate(['/second step']);
    }
  }
}