import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
      console.log('AuthGuard: Admin logged in, allowing access');
      return true;
    } else {
      console.log('AuthGuard: No admin logged in, redirecting to /admin/login');
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}