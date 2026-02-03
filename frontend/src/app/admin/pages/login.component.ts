import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ADMIN_PATH } from '../admin.config';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card animate-in">
        <div class="login-header">
          <img src="images/logo.png" alt="Logo" class="logo">
          <h1>Espace <span>Admin</span></h1>
          <p>Connectez-vous pour gérer votre plateforme</p>
        </div>

        <form (submit)="onSubmit($event)" class="login-form">
          <div class="form-group">
            <label for="email">Adresse Email</label>
            <div class="input-wrapper">
              <i class="icon-email"></i>
              <input 
                type="email" 
                id="email" 
                [(ngModel)]="email" 
                name="email" 
                placeholder="admin@ods.tech"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <i class="icon-lock"></i>
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                id="password" 
                [(ngModel)]="password" 
                name="password" 
                placeholder="••••••••"
                required
              >
              <button type="button" class="toggle-password" (click)="togglePassword()" [title]="showPassword() ? 'Masquer' : 'Afficher'">
                @if (showPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 4.5 12 4.5c4.792 0 8.601 3.549 9.963 7.178.07.207.07.431 0 .639C20.577 16.491 16.79 20 12 20c-4.791 0-8.603-3.549-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              </button>
            </div>
          </div>

          <div *ngIf="error()" class="error-message">
            {{ error() }}
          </div>

          <button type="submit" class="btn-login" [disabled]="isSubmitting()">
            <span *ngIf="!isSubmitting()">Se connecter</span>
            <span *ngIf="isSubmitting()" class="loader"></span>
          </button>
        </form>

        <div class="login-footer">
          <a routerLink="/" class="back-link">← Retour au site public</a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = signal(false);
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitting.set(true);
    this.error.set(null);

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate([`/${ADMIN_PATH}`]);
    } catch (err: any) {
      console.error(err);
      this.error.set('Email ou mot de passe incorrect.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
