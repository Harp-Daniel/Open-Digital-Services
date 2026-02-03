import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { map, take } from 'rxjs';
import { ADMIN_PATH } from '../admin.config';
import { User } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.authState$.pipe(
        take(1),
        map((user: User | null) => {
            console.log('[AuthGuard] Checking access for path:', state.url, '- User:', user ? user.email : 'Not logged in');
            if (user) return true;
            return router.createUrlTree([`/${ADMIN_PATH}/login`]);
        })
    );
};
