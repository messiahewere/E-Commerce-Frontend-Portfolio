import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = () => {
    const authService = inject(Auth);
    const router = inject(Router);
    
    if (authService.isAuthenticated()) {
        router.navigate(['/home']);
        return false;
    }
    return true;
};
