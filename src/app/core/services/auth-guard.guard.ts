import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.getUserLoggedIn$.subscribe(res => {
    if (!res) router.navigate(['/sign-in']);
  });
  return authService.getUserLoggedIn$;
};
