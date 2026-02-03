import { Injectable, inject, signal } from '@angular/core';
import {
    Auth,
    signInWithEmailAndPassword,
    signOut,
    authState,
    user,
    User
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ADMIN_PATH } from '../../admin/admin.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private router = inject(Router);

    currentUser = signal<User | null>(null);
    loading = signal(true);

    user$: Observable<User | null> = user(this.auth);
    authState$: Observable<User | null> = authState(this.auth);

    constructor() {
        this.authState$.subscribe(user => {
            console.log('[AuthService] Current User Updated:', user ? user.email : 'None');
            this.currentUser.set(user);
            this.loading.set(false);
        });
    }

    async login(email: string, pass: string) {
        return signInWithEmailAndPassword(this.auth, email, pass);
    }

    async logout() {
        await signOut(this.auth);
        this.router.navigate(['/ods-management-portal-x9/login']);
    }

    get isLoggedIn(): boolean {
        return !!this.currentUser();
    }
}
