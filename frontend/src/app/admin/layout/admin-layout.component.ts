import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AdminSidebarComponent } from '../components/admin-sidebar.component';
import { AdminHeaderComponent } from '../components/admin-header.component';
import { SidebarService } from '../services/sidebar.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent, AdminHeaderComponent],
  template: `
    <div class="admin-layout" 
         [class.mobile-open]="isMobileMenuOpen()" 
         [class.sidebar-collapsed]="sidebarService.isCollapsed()">
      <!-- Mobile Overlay -->
      <div class="mobile-overlay" *ngIf="isMobileMenuOpen()" (click)="closeMobileMenu()"></div>

      <app-admin-sidebar [class.collapsed]="sidebarService.isCollapsed()"></app-admin-sidebar>
      
      <div class="admin-main">
        <app-admin-header (menuToggle)="toggleMobileMenu()"></app-admin-header>
        
        <main class="admin-content">
          <div class="admin-container">
            <router-outlet></router-outlet>
          </div>
        </main>

        <footer class="admin-footer p-4 text-center text-sm opacity-60">
          &copy; 2025 Open Digital Services - Dashboard Admin
        </footer>
      </div>
    </div>
  `,
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  sidebarService = inject(SidebarService);
  private router = inject(Router);
  isMobileMenuOpen = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
