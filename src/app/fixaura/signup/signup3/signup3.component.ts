import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SignupService } from '../signup.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signup3',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './signup3.component.html',
  styleUrl: './signup3.component.css',
})
export class Signup3Component {
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false; 
  showConfirmPassword: boolean = false;

  constructor(private router: Router, private http: HttpClient,private signupService: SignupService) {}

  onConfirm() {
    if (this.password !== this.confirmPassword || !this.password.length) {
      console.log('Passwords do not match or are empty');
      return;
    }

    const step1Data = this.signupService.getData().step1 || {};
    const step2Data = this.signupService.getData().step2 || {};
    const signupData = {
      ...step1Data,
      ...step2Data,
      password: this.password,
    };

    const formData = new FormData();
    Object.keys(signupData).forEach(key => {
      if (key === 'imageFile' && signupData[key] instanceof File) {
        formData.append('image', signupData[key]);
        console.log('Appending image:', signupData[key].name, signupData[key].type, signupData[key].size);
      } else if (key !== 'imagePreview') { // Exclude imagePreview from FormData
        formData.append(key, signupData[key]);
      }
    });

    this.http.post(`${environment.baseUrl}/auth/signup`, formData).subscribe({
      next: (response: any) => {
        console.log('Signup successful:', response);
        this.signupService.clearData();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup error:', error);
        // Handle specific errors (e.g., email exists) with a user message
      },
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}