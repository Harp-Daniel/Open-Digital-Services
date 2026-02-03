import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="about-container">
      <section class="about-hero animate-in">
        <div class="hero-content">
          <h1>Innovation, Proximité & <span>Expertise</span></h1>
          <p>Open Digital Services est née de la volonté d'offrir des solutions technologiques de pointe adaptées aux défis du continent africain.</p>
        </div>
      </section>

      <section class="mission-vision">
        <div class="content-wrapper">
          <div class="mission animate-in-scroll">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 22.5 12 13.5H3.75Z" />
              </svg>
            </div>
            <h2>Notre Mission</h2>
            <p>Démocratiser l'accès aux technologies numériques de haute qualité et accompagner nos partenaires dans leur transformation digitale avec agilité et excellence.</p>
          </div>

          <div class="vision animate-in-scroll">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2>Notre Vision</h2>
            <p>Devenir le leader panafricain de l'intégration de services numériques, reconnu pour l'impact positif de nos solutions sur le développement des entreprises locales.</p>
          </div>
        </div>
      </section>

      <section class="values-section">
        <div class="section-header animate-in-scroll">
          <h2>Nos Valeurs Fondamentales</h2>
          <p>Ce qui guide chacune de nos actions et décisions au quotidien.</p>
        </div>
        
        <div class="values-grid">
          <div class="value-card animate-in-scroll">
            <h3>Excellence</h3>
            <p>Nous ne nous contentons pas du "bien assez", nous visons la perfection technique dans chaque projet.</p>
          </div>
          <div class="value-card animate-in-scroll">
            <h3>Intégrité</h3>
            <p>La transparence et l'éthique sont les piliers de notre relation avec nos clients et partenaires.</p>
          </div>
          <div class="value-card animate-in-scroll">
            <h3>Innovation</h3>
            <p>Nous explorons constamment de nouvelles technologies pour offrir un avantage compétitif à nos clients.</p>
          </div>
        </div>
      </section>
    </div>
  `,
    styleUrl: './about.component.scss'
})
export class AboutComponent { }
