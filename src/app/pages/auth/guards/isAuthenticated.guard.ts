import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStatus } from '../interfaces';
import { AuthService } from '../auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  if (authenticationService.authStatus() === AuthStatus.authenticated) {
    return true;
  }

  if (authenticationService.authStatus() === AuthStatus.checking) {
    return false;
  }

  router.navigateByUrl('/auth');
  return false;
};