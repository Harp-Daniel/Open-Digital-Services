import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { FooterComponent } from '../components/footer.component';
import { CookieConsentComponent } from '../../shared/components/cookie-consent.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, CookieConsentComponent],
  template: `
    <div class="public-layout">
      <app-navbar></app-navbar>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
      <app-cookie-consent></app-cookie-consent>
    </div>
  `,
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent { }
