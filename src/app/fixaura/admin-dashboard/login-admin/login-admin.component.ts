// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-login-admin',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     HttpClientModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule
//   ],
//   templateUrl: './login-admin.component.html',
//   styleUrls: ['./login-admin.component.scss']
// })
// export class LoginAdminComponent implements OnInit {
//   loginForm: FormGroup;
//   isLoading = false;
//   errorMessage: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   ngOnInit(): void {}

//   onSubmit(): void {
//     if (this.loginForm.valid) {
//       this.isLoading = true;
//       this.errorMessage = null;

//       const { email, password } = this.loginForm.value;
//       this.http.post<{ message: string; admin: { email: string } }>('http://localhost:3000/admins/login', { email, password })
//         .subscribe({
//           next: (response) => {
//             this.isLoading = false;
//             localStorage.setItem('isAdminLoggedIn', 'true'); // Store admin login flag
//             localStorage.setItem('adminEmail', response.admin.email); // Optional: store email for later use
//             console.log('Login successful, navigating to /admin/dashboard');
//             this.router.navigate(['/admin/dashboard']).then(success => {
//               console.log('Navigation success:', success);
//             });
//           },
//           error: (error) => {
//             this.isLoading = false;
//             this.errorMessage = error.error.message || 'An error occurred during login';
//             console.error('Login error:', error);
//           }
//         });
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const { email, password } = this.loginForm.value;
      this.http.post<{ message: string; admin: { email: string } }>('http://localhost:3000/admins/login', { email, password })
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            localStorage.setItem('isAdminLoggedIn', 'true');
            localStorage.setItem('adminEmail', response.admin.email);
            console.log('Login successful, navigating to /admin/dashboard');
            this.router.navigate(['/admin/dashboard']).then(success => {
              console.log('Navigation success:', success);
            });
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error.message || 'An error occurred during login';
            console.error('Login error:', error);
          }
        });
    }
  }
}