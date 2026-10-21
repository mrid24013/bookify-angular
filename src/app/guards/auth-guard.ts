import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //Maneja las redirecciones del estatus de la sesion actual
  if (authService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};