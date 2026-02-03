import { Component, inject, HostListener, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../shared/services/theme.service';
import { SettingsService } from '../../shared/services/settings.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.glass]="isScrolled">
      <div class="nav-container">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <img src="images/logo.png" alt="Open Digital Logo" class="logo-image">
        </a>

        <!-- Navigation Links -->
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a></li>
          <li><a routerLink="/services" routerLinkActive="active">Services</a></li>
          @if (showTeamPage()) {
            <li><a routerLink="/notre-equipe" routerLinkActive="active">Équipe</a></li>
          }
          <li><a routerLink="/about" routerLinkActive="active">À Propos</a></li>
          <li><a routerLink="/faq" routerLinkActive="active">FAQ</a></li>
          <li><a routerLink="/contact" routerLinkActive="active">Contact</a></li>
        </ul>

        <!-- Actions -->
        <div class="nav-actions">
          <button class="theme-toggle" (click)="themeService.toggleTheme()" [title]="themeService.theme() === 'dark' ? 'Mode Clair' : 'Mode Sombre'">
            <svg *ngIf="themeService.theme() === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            <svg *ngIf="themeService.theme() === 'dark'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M12 18.75V15m0-6V3m0 0a9 9 0 100 18 9 9 0 000-18z" />
            </svg>
          </button>
          
          <a routerLink="/suivi" class="btn-primary desktop-only">Partenaires</a>

          <!-- Mobile Toggle -->
          <button class="mobile-toggle" (click)="toggleMenu()" [class.open]="isMenuOpen()">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Overlay -->
      <div class="mobile-overlay" [class.active]="isMenuOpen()" (click)="closeMenu()">
        <ul class="mobile-links" (click)="$event.stopPropagation()">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Accueil</a></li>
          <li><a routerLink="/services" routerLinkActive="active" (click)="closeMenu()">Services</a></li>
          @if (showTeamPage()) {
            <li><a routerLink="/notre-equipe" routerLinkActive="active" (click)="closeMenu()">Équipe</a></li>
          }
          <li><a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">À Propos</a></li>
          <li><a routerLink="/faq" routerLinkActive="active" (click)="closeMenu()">FAQ</a></li>
          <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a></li>
          <li class="mt-4"><a routerLink="/suivi" class="btn-primary" (click)="closeMenu()">Partenaires</a></li>
        </ul>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  themeService = inject(ThemeService);
  private settingsService = inject(SettingsService);

  isScrolled = false;
  isMenuOpen = signal(false);
  showTeamPage = signal(false);

  ngOnInit() {
    this.settingsService.getSettings().subscribe(settings => {
      if (settings) {
        this.showTeamPage.set(settings.showTeamPage);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
