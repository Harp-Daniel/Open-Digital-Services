import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="admin-header">
      <div class="header-left">
        <button (click)="menuToggle.emit()" class="mobile-menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h2 class="header-title">Administration</h2>
      </div>

      <div class="header-actions">
        <button class="theme-toggle" (click)="themeService.toggleTheme()" [title]="themeService.theme() === 'dark' ? 'Mode Clair' : 'Mode Sombre'">
          <svg *ngIf="themeService.theme() === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
          <svg *ngIf="themeService.theme() === 'dark'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M12 18.75V15m0-6V3m0 0a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
        </button>

        <div class="user-profile">
          <div class="user-info">
            <p class="user-name">Administrateur</p>
            <p class="user-role">Super Admin</p>
          </div>
          <div class="user-avatar">
            A
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
  themeService = inject(ThemeService);
  @Output() menuToggle = new EventEmitter<void>();
}
