import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
})
export class Step3Component implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  email: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Fetch email from query parameters
    // this.route.queryParams.subscribe(params => {
    //   this.email = params['email'] || null;
    //   if (!this.email) {
    //     this.errorMessage = 'No email provided. Please start the process again.';
    //   }
    // });
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onResetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in both password fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!this.email) {
      this.errorMessage = 'No email provided. Please start the process again.';
      return;
    }

    this.http.post(`${environment.baseUrl}/auth/reset-password`, { email: this.email, password: this.newPassword }).subscribe({
      next: (response: any) => {
        console.log('Password reset successfully:', response);
        this.successMessage = 'Password reset successfully! Redirecting to login...';
        this.errorMessage = null;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        this.errorMessage = error.error.message || 'Failed to reset password.';
        this.successMessage = null;
      },
    });
  }

  onGoToLogin() {
    this.router.navigate(['/login']);
  }
}