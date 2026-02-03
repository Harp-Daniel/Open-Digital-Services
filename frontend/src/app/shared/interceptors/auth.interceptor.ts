import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { switchMap, take, from } from 'rxjs';
import { API_URL } from '../../config';

/**
 * Automatically attaches Firebase ID Token to every request sent to our API.
 * This ensures the backend can verify the administrator's identity.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(Auth);

    // Only intercept requests to our internal API
    if (!req.url.startsWith(API_URL)) {
        return next(req);
    }

    return user(auth).pipe(
        take(1),
        switchMap(u => {
            if (u) {
                // Get the token from current Firebase user
                return from(u.getIdToken()).pipe(
                    switchMap(token => {
                        const authReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        return next(authReq);
                    })
                );
            }
            // Not logged in or public request
            return next(req);
        })
    );
};
