import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Retrieve user data from localStorage
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  // Check if user is authenticated and is a client
  if (userId && userType === 'client') {
    // Verify the route's :id matches the authenticated user's ID
    const routeId = route.paramMap.get('id');
    if (routeId === userId) {
      return true;
    }
  }

  // Redirect to login if not authenticated, not a client, or ID mismatch
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
