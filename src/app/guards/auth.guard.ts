/**
 * Auth Guard
 * Student: JiemingLiu
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 4 (Navigation and Routing)
 * Description: Route guard to protect pages requiring authentication
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
