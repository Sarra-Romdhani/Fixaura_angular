import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';

interface SignInResponse {
  data: {
    type: string;
    user: { id: string };
  };
  message?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isObscured = true;
  isLoading = false;
  isDarkTheme = false;
  logoError = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  togglePasswordVisibility(): void {
    this.isObscured = !this.isObscured;
  }

  signIn(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs correctement', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    this.http.post<SignInResponse>(
      `${environment.baseUrl}/auth/signin`,
      { email: trimmedEmail, password: trimmedPassword },
      { headers: { 'Content-Type': 'application/json' } }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          localStorage.setItem('userId', response.data.user.id);
          localStorage.setItem('userType', response.data.type);
          
          if (response.data.type === 'client') {
            console.log('Navigating to choose-service with ID:', response.data.user.id);
            this.router.navigate([`/choose-service/${response.data.user.id}`]).then(success => {
              console.log('Navigation success:', success);
            }).catch(err => {
              console.error('Navigation error:', err);
            });
          } else if (response.data.type === 'prestataire') {
            this.router.navigate([`/home/${response.data.user.id}`]);
          } else {
            this.snackBar.open('Type d\'utilisateur non reconnu', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          console.log('Error response:', error);
          this.isLoading = false;
          const message = error.status === 401 ? 'Email ou mot de passe incorrect' : error.error?.message || 'Erreur réseau ou serveur indisponible';
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}