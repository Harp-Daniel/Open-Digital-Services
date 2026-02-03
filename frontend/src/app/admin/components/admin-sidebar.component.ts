import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { ADMIN_PATH } from '../admin.config';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="admin-sidebar" [class.collapsed]="sidebarService.isCollapsed()">
      <div class="sidebar-header">
        <a [routerLink]="'/' + adminPath" class="logo">
          <img src="images/logo.png" alt="Logo" class="logo-img">
          <span class="logo-text" *ngIf="!sidebarService.isCollapsed()">Admin</span>
        </a>
        <button (click)="toggleCollapse()" class="collapse-btn" [title]="sidebarService.isCollapsed() ? 'Agrandir' : 'Réduire'">
          <svg *ngIf="!sidebarService.isCollapsed()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <svg *ngIf="sidebarService.isCollapsed()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li>
            <a [routerLink]="'/' + adminPath" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" title="Dashboard">
              <i class="icon-dashboard"></i>
              <span *ngIf="!sidebarService.isCollapsed()">Dashboard</span>
            </a>
          </li>
          <li>
            <a [routerLink]="'/' + adminPath + '/services'" routerLinkActive="active" title="Services">
              <i class="icon-services"></i>
              <span *ngIf="!sidebarService.isCollapsed()">Services</span>
            </a>
          </li>
          <li>
            <a [routerLink]="'/' + adminPath + '/contacts'" routerLinkActive="active" title="Contacts">
              <i class="icon-contacts"></i>
              <span *ngIf="!sidebarService.isCollapsed()">Contacts</span>
            </a>
          </li>
          <li>
            <a [routerLink]="'/' + adminPath + '/partners'" routerLinkActive="active" title="Partenaires">
              <i class="icon-partners"></i>
              <span *ngIf="!sidebarService.isCollapsed()">Partenaires</span>
            </a>
          </li>
          <li>
            <a [routerLink]="'/' + adminPath + '/team'" routerLinkActive="active" title="Équipe">
              <i class="icon-team"></i>
              <span *ngIf="!sidebarService.isCollapsed()">Équipe</span>
            </a>
          </li>
          <li>
            <a [routerLink]="'/' + adminPath + '/settings'" routerLinkActive="active" title="Paramètres">
              <i class="icon-settings"></i>
              <span *ngIf="!sidebarService.isCollapsed()">Paramètres</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {
  sidebarService = inject(SidebarService);
  adminPath = ADMIN_PATH;

  toggleCollapse() {
    this.sidebarService.toggleCollapse();
  }
}
