import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStatus } from '../interfaces';
import { AuthService } from '../auth.service';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  if (authenticationService.authStatus() === AuthStatus.authenticated) {
    router.navigateByUrl('/admin');
    return false;
  }

  return true;
};