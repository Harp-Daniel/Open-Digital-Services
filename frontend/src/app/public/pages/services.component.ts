import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ServicesService, ServiceItem } from '../../shared/services/services.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="services-container">
      <section class="services-header animate-in">
        <div class="header-content">
          <h1>Nos <span>Expertises</span></h1>
          <p>Découvrez l'ensemble de nos services technologiques conçus pour propulser votre entreprise vers de nouveaux sommets.</p>
        </div>
      </section>

      <div class="category-nav">
        <div class="nav-wrapper">
          <button 
            class="nav-btn" 
            [class.active]="selectedCategory() === 'all'"
            (click)="selectCategory('all')">
            Tout
          </button>
          @for (categoryName of categories(); track categoryName) {
            <button 
              class="nav-btn" 
              [class.active]="selectedCategory() === categoryName"
              (click)="selectCategory(categoryName)">
              {{ categoryName }}
            </button>
          }
        </div>
      </div>

      @if (isLoading()) {
        <div class="skeleton-container">
          <div class="skeleton-title"></div>
          <div class="services-grid">
            @for (i of [1,2,3,4]; track i) {
              <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-info">
                  <div class="skeleton-text-lg"></div>
                  <div class="skeleton-text-md"></div>
                  <div class="skeleton-tags">
                    <div class="skeleton-tag"></div>
                    <div class="skeleton-tag"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        @for (category of groupedServices(); track category.name) {
          @if (selectedCategory() === 'all' || selectedCategory() === category.name) {
            <section class="category-section" [id]="category.name.toLowerCase().replace(' ', '-')">
              
              <div class="category-title">
                <h2>{{ category.name }}</h2>
                <div class="line"></div>
              </div>

              <!-- Category Banner Hero (Refined Overlay Layout) -->
              @if (selectedCategory() !== 'all' && banners()[category.name] && banners()[category.name].length > 0) {
                <div class="banner-hero animate-in">
                  <div class="banner-wrapper">
                    <!-- Full-width Sliding Image Carousel -->
                    <div class="banner-visual">
                      <div class="carousel-track" [style.transform]="getCarouselTransform(category.name)">
                        @for (img of banners()[category.name]; track $index) {
                          <div class="carousel-slide">
                            <img [src]="optimizeUrl(img, 1200)" [alt]="category.name" [attr.fetchpriority]="selectedCategory() === category.name ? 'high' : 'auto'">
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Text Content Overlay -->
                    <div class="banner-overlay">
                      <div class="banner-info">
                        <span class="banner-badge">À LA CARTE</span>
                        <h2 class="banner-title">{{ category.name }}</h2>
                        <p class="banner-description">Transformez votre vision en réalité avec nos solutions professionnelles et notre expertise technologique dédiée.</p>
                        <button class="banner-action">DÉCOUVRIR LES OFFRES</button>
                      </div>

                      <!-- Subtle Indicators -->
                      <div class="carousel-indicators">
                        @for (img of banners()[category.name]; track $index) {
                          <div 
                            class="indicator" 
                            [class.active]="activeBannerIndices()[category.name] === $index">
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }

              <div class="services-grid">
                @for (service of category.items; track service.id) {
                  <div class="service-item-card">
                    <div class="service-img">
                      <img [src]="optimizeUrl(service.image, 600)" [alt]="service.title" loading="lazy">
                      <div class="overlay"></div>
                    </div>
                    
                    <div class="service-info">
                      <div class="icon-wrapper" [innerHTML]="getSafeIcon(service.icon)"></div>
                      <h3>{{ service.title }}</h3>
                      <p>{{ service.description }}</p>
                      
                      <div class="tag-cloud">
                        @for (tag of service.tags; track tag) {
                          <span class="tag">{{ tag }}</span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        }
      }
    </div>
  `,
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private servicesService = inject(ServicesService);
  private cdr = inject(ChangeDetectorRef);

  services = signal<ServiceItem[]>([]);
  selectedCategory = signal<string>('all');
  banners = signal<Record<string, string[]>>({});
  activeBannerIndices = signal<Record<string, number>>({});
  isLoading = signal<boolean>(true);

  categories = computed(() => {
    const cats = this.services().map(s => s.category);
    return [...new Set(cats)];
  });

  groupedServices = computed(() => {
    const cats = this.categories();
    return cats.map(cat => ({
      name: cat,
      items: this.services().filter(s => s.category === cat)
    }));
  });

  ngOnInit() {
    // Immediate load from cache to avoid flicker
    const cached = this.servicesService.getCachedServices();
    if (cached) {
      this.services.set(cached);
      this.loadBanners(cached);
      this.isLoading.set(false);
    }

    this.loadServices();
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.selectCategory(category);
      }
    });

    // Carousel interval
    setInterval(() => {
      this.activeBannerIndices.update(indices => {
        const newIndices = { ...indices };
        Object.keys(newIndices).forEach(cat => {
          const images = this.banners()[cat];
          if (images && images.length > 1) {
            newIndices[cat] = (newIndices[cat] + 1) % images.length;
          }
        });
        return newIndices;
      });
    }, 5000);
  }

  loadServices() {
    // Don't show skeleton if we have cached data
    if (this.services().length === 0) {
      this.isLoading.set(true);
    }

    this.servicesService.getServices().subscribe(data => {
      this.services.set(data);
      this.loadBanners(data);
      this.isLoading.set(false);
      this.cdr.detectChanges();
    });
  }

  optimizeUrl(url: string, width: number = 800): string {
    return this.servicesService.getOptimizedImageUrl(url, width);
  }

  loadBanners(services: ServiceItem[]) {
    const cats = [...new Set(services.map(s => s.category))];
    cats.forEach(cat => {
      this.servicesService.getCategoryBanner(cat).subscribe(banner => {
        if (banner && banner.images && banner.images.some(img => img)) {
          this.banners.update(prev => ({ ...prev, [cat]: banner.images.filter(img => img !== '') }));
          this.activeBannerIndices.update(prev => ({ ...prev, [cat]: 0 }));
        }
      });
    });
  }

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }

  getCarouselTransform(category: string): string {
    const index = this.activeBannerIndices()[category] || 0;
    return `translateX(-${index * 100}%)`;
  }
}
