import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css'],
})
export class Step2Component implements OnInit {

  code: string = '';
  email: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   this.email = params['email'] || null;
    //   if (!this.email) {
    //     this.errorMessage = 'No email provided. Please start the process again.';
    //   }
    // });
  }

  onVerifyCode() {
    if (!this.code || !this.email) {
      this.errorMessage = 'Please enter the verification code';
      return;
    }

    this.http.post(`${environment.baseUrl}/auth/verify-code`, { email: this.email, code: this.code }).subscribe({
      next: (response: any) => {
        console.log('Code verified successfully:', response);
        this.successMessage = 'Code verified successfully!';
        this.errorMessage = null;
        // Navigate to the next step (e.g., reset password page)
        setTimeout(() => {
          this.router.navigate(['/reset-password-step3'], { queryParams: { email: this.email } });
        }, 2000);
      },
      error: (error) => {
        console.error('Error verifying code:', error);
        this.errorMessage = error.error.message || 'Invalid code. Please try again.';
        this.successMessage = null;
      },
    });
  }

  onResendCode() {
    this.router.navigate(['/enter email']);
  }
  onNext() {
    this.router.navigate(['/update password']);
  }
}