import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-cookie-consent',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (isVisible()) {
      <div class="cookie-overlay" @fadeScale>
        <div class="cookie-banner">
          <div class="cookie-content">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div class="text">
              <h4>Nous respectons votre vie privée</h4>
              <p>Nous utilisons des cookies pour améliorer votre expérience de navigation, diffuser des publicités ou des contenus personnalisés et analyser notre trafic. En cliquant sur "Tout Accepter", vous consentez à notre utilisation des cookies.</p>
            </div>
          </div>
          
          <div class="cookie-actions">
            <button class="btn-outline" (click)="acceptEssential()">Essentiels seulement</button>
            <button class="btn-primary" (click)="acceptAll()">Tout Accepter</button>
          </div>
        </div>
      </div>
    }
  `,
    styleUrl: './cookie-consent.component.scss',
    animations: [
        trigger('fadeScale', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
                animate('400ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }))
            ])
        ])
    ]
})
export class CookieConsentComponent implements OnInit {
    isVisible = signal(false);

    ngOnInit() {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Small delay for better UX
            setTimeout(() => this.isVisible.set(true), 1500);
        }
    }

    acceptAll() {
        localStorage.setItem('cookie-consent', 'all');
        this.isVisible.set(false);
    }

    acceptEssential() {
        localStorage.setItem('cookie-consent', 'essential');
        this.isVisible.set(false);
    }
}
