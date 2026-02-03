import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <!-- Brand -->
        <div class="footer-brand">
          <a routerLink="/" class="logo">
            <span class="logo-text">Open <span class="highlight">Digital Services</span></span>
          </a>
          <p>Votre partenaire de confiance pour toutes vos solutions numériques, de l'infrastructure à la maintenance logicielle.</p>
          <div class="social-links">
            <a href="https://www.facebook.com/profil.php?id=61587134172928" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@odssolutions01?_r=1&_t=ZS-93aFUTOsBXt" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.9-.39-2.81-.12-.47.1-.92.35-1.3.66-.96.84-1.24 2.19-.73 3.29.36.7.97 1.24 1.72 1.49.54.18 1.14.2 1.7.07.81-.14 1.58-.66 2.01-1.36.25-.38.38-.82.41-1.27.1-.6.04-1.2.04-1.81V0l.13.02z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@ods-solutions" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://wa.me/0841006706" target="_blank" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div> 

        <!-- Services -->
        <div class="footer-links">
          <h4>Services</h4>
          <ul>
            @for (service of services; track service) {
              <li><a [routerLink]="['/services']" [queryParams]="{ category: service }">{{ service }}</a></li>
            }
          </ul>
        </div>

        <!-- Liens Rapides -->
        <div class="footer-links">
          <h4>Liens Rapides</h4>
          <ul>
            <li><a routerLink="/about">À Propos</a></li>
            <li><a routerLink="/contact">Contact</a></li>
            <li><a routerLink="/faq">FAQ</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-links">
          <h4>Contact</h4>
          <ul>
            <li><i class="fas fa-map-marker-alt"></i> Kinshasa, RDC</li>
            <li><i class="fas fa-phone"></i> +243 841 060 706</li>
            <li><i class="fas fa-envelope"></i> contact@odssolutions.com</li>
          </ul> 
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Open Digital Services. Tous droits réservés.</p>
        <div class="footer-legal">
          <a routerLink="/privacy">Politique de Confidentialité</a>
          <a routerLink="/terms">Conditions d'utilisation</a>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  services = [
    'Développement Web',
    'Installation Caméra',
    'Réseau Informatique',
    'Photographie & Vidéo',
    'Maintenance IT',
    'Marketing Digital'
  ];
}
