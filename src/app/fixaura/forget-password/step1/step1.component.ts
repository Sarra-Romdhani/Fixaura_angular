import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule,MatIconModule],
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
})
export class Step1Component {
  email: string = '';
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSendCode() {
    if (!this.email) {
      this.errorMessage = 'Please enter an email address';
      return;
    }

    this.http.post(`${environment.baseUrl}/auth/forgot-password`, { email: this.email }).subscribe({
      next: (response: any) => {
        console.log('Code sent successfully:', response);
        this.router.navigate(['/verify-code'], { queryParams: { email: this.email } });
      },
      error: (error) => {
        console.error('Error sending code:', error);
        this.errorMessage = error.error.message || 'Failed to send code';
      },
    });
  }

  onSignUp() {
    this.router.navigate(['/first step']);
  }
  onNext() {
    this.router.navigate(['/enter code']);
  }
}