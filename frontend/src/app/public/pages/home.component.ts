import { Component, inject, OnInit, signal, ChangeDetectorRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServicesService } from '../../shared/services/services.service';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section animate-in">
        <div class="hero-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>

        <div class="hero-container">
          <div class="hero-content">
            <div class="badge">
              <span class="dot"></span>
              L'excellence au service du numérique
            </div>
            
            <h1>Propulsez votre <span>Vision Digital</span></h1>
            
            <p>Open Digital Services transforme vos idées en réalités technologiques. De l'infrastructure réseau au développement web, nous bâtissons le futur ensemble.</p>
            
            <div class="cta-group">
              <a routerLink="/services" class="btn-primary">Nos Services</a>
              <a routerLink="/contact" class="btn-outline">Contactez-nous</a>
            </div>
          </div>

          <div class="hero-image">
             <div class="main-img-card banner-style">
                <div class="banner-visual">
                  <div class="carousel-track" [style.transform]="getCarouselTransform()">
                    @if (bannerImages().length > 0) {
                      @for (img of bannerImages(); track $index) {
                        <div class="carousel-slide">
                          <img [src]="optimizeUrl(img, 800)" alt="Service Banner" [attr.fetchpriority]="$index === 0 ? 'high' : 'auto'">
                        </div>
                      }
                    } @else {
                      <div class="carousel-slide">
                        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" alt="Digital Innovation">
                      </div>
                    }
                  </div>
                </div>
                <div class="overlay"></div>
                
                <!-- Indicators -->
                @if (bannerImages().length > 1) {
                  <div class="carousel-indicators">
                    @for (img of bannerImages(); track $index) {
                      <div 
                        class="indicator" 
                        [class.active]="activeBannerIndex() === $index">
                      </div>
                    }
                  </div>
                }
             </div>
             
             <!-- Floating Badge -->
             <div class="floating-card">
                <div class="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 24px; height: 24px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 22.5 12 13.5H3.75Z" />
                  </svg>
                </div>
                <h4>Livraison Rapide</h4>
                <span>Des solutions fiables pour votre entreprise.</span>
             </div>
          </div>
        </div>
      </section>

      <!-- Services Overview -->
      <section class="services-preview animate-in-scroll">
        <div class="section-header">
          <h2>Nos Solutions Numériques</h2>
          <p>Explorez notre gamme complète de services conçus pour répondre à tous vos besoins technologiques.</p>
        </div>

        <div class="services-grid">
          @for (service of services; track service.title) {
            <div class="service-card">
              <div class="icon-box">
                <div [innerHTML]="getSafeIcon(service.icon)"></div>
              </div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              <a [routerLink]="['/services']" [queryParams]="{ category: service.title }" class="details-link">
                Détails 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 16px; height: 16px;">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private servicesService = inject(ServicesService);
  private analyticsService = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  bannerImages = signal<string[]>([]);
  activeBannerIndex = signal<number>(0);

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  ngOnInit() {
    this.loadDynamicBanners();
    this.analyticsService.recordHit('home');

    // Carousel interval
    setInterval(() => {
      if (this.bannerImages().length > 1) {
        this.activeBannerIndex.update(idx => (idx + 1) % this.bannerImages().length);
        this.cdr.detectChanges();
      }
    }, 5000);
  }

  loadDynamicBanners() {
    this.servicesService.getServices().subscribe(services => {
      const uniqueCats = [...new Set(services.map(s => s.category))];
      const images: string[] = [];
      let loadedCats = 0;

      uniqueCats.forEach(cat => {
        this.servicesService.getCategoryBanner(cat).subscribe(banner => {
          if (banner && banner.images && banner.images.length > 0) {
            // Take the first valid image from each category banner
            const firstImg = banner.images.find(img => img !== '');
            if (firstImg) images.push(firstImg);
          }
          loadedCats++;
          if (loadedCats === uniqueCats.length) {
            this.bannerImages.set(images);
            this.cdr.detectChanges();
          }
        });
      });
    });
  }

  optimizeUrl(url: string, width: number = 800): string {
    return this.servicesService.getOptimizedImageUrl(url, width);
  }

  getCarouselTransform(): string {
    return `translateX(-${this.activeBannerIndex() * 100}%)`;
  }

  services = [
    {
      title: 'Développement Web',
      description: "Création de sites internet modernes, responsives et optimisés pour booster votre présence en ligne.",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 32px; height: 32px;"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>'
    },
    {
      title: 'Installation Caméra',
      description: 'Sécurisez vos locaux avec nos systèmes de surveillance haute définition et accès à distance.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 32px; height: 32px;"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>'
    },
    {
      title: 'Réseau Informatique',
      description: 'Conception et installation de réseaux stables, rapides et sécurisés pour votre entreprise.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 32px; height: 32px;"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5a2.25 2.25 0 0 0 2.25-2.25v-15.3a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 3.545V21Z" /></svg>'
    },
    {
      title: 'Photographie & Vidéo',
      description: "Captation et montage de contenus visuels professionnels pour valoriser votre image de marque.",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 32px; height: 32px;"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>'
    },
    {
      title: 'Maintenance IT',
      description: 'Support technique préventif et curatif pour assurer la continuité de vos activités.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 32px; height: 32px;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83m0 0a2.978 2.978 0 01-4.144 0l-5.83 5.83A2.652 2.652 0 113 13.5l5.83-5.83m0 0a2.978 2.978 0 010-4.144L12.67 11.42m0 0a2.978 2.978 0 014.144 0l5.83-5.83A2.652 2.652 0 1121 9l-5.83 5.83" /></svg>'
    },
    {
      title: 'Marketing Digital',
      description: "Stratégies de croissance personnalisées : SEO, réseaux sociaux et publicité pour attirer vos clients.",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 32px; height: 32px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.007.51.01.77.01.28 0 .56-.003.837-.01m0-9.18c-.253-.007-.51-.01-.77-.01-.28 0-.56.003-.837.01m0 9.18c4.676.125 7.44 2.215 7.44 4.385v1.233c0 .538-.214 1.055-.595 1.436L14.4 21.3m0 0l2.7-2.7m-2.7 2.7l-2.7-2.7M12.75 3c-.11 0-.214.01-.318.024A2.25 2.25 0 0 1 10.5 5.25V6m2.25-3c.11 0 .214.01.318.024A2.25 2.25 0 0 0 15 5.25V6m-2.25-3v3m-3.07 10.68c-.733.064-1.467.094-2.204.094a1.5 1.5 0 0 1-1.496-1.5V11.25a1.5 1.5 0 0 1 1.496-1.5c.737 0 1.47.03 2.204.094" /></svg>'
    }
  ];
}
