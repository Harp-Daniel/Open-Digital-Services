import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-terms',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="terms-container">
      <section class="terms-hero animate-in">
        <div class="hero-content">
          <span class="badge">Légal</span>
          <h1>Conditions <span>d'Utilisation</span></h1>
          <p>Bienvenue sur Open Digital Services. En utilisant notre plateforme, vous acceptez les conditions détaillées ci-dessous.</p>
          <div class="last-update">Dernière mise à jour : 22 Janvier 2026</div>
        </div>
      </section>

      <section class="terms-content">
        <div class="content-wrapper">
          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">01</div>
              <h2>Objet</h2>
            </div>
            <div class="card-body">
              <p>Les présentes Conditions d'Utilisation ont pour objet de définir les modalités de mise à disposition des services du site Open Digital Services et les conditions d'utilisation du site par l'Utilisateur.</p>
            </div>
          </div>

          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">02</div>
              <h2>Propriété Intellectuelle</h2>
            </div>
            <div class="card-body">
              <p>La structure générale du site Open Digital Services, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété de l'éditeur ou de ses partenaires. Toute représentation et/ou reproduction et/ou exploitation partielle ou totale des contenus et services proposés par le site, par quelque procédé que ce soit, sans l'autorisation préalable et par écrit de Open Digital Services est strictement interdite.</p>
            </div>
          </div>

          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">03</div>
              <h2>Responsabilité de l'Éditeur</h2>
            </div>
            <div class="card-body">
              <p>Les informations et/ou documents figurant sur ce site et/ou accessibles par ce site proviennent de sources considérées comme étant fiables. Toutefois, ces informations et/ou documents sont susceptibles de contenir des inexactitudes techniques et des erreurs typographiques.</p>
              <p>Open Digital Services se réserve le droit de les corriger, dès que ces erreurs sont portées à sa connaissance.</p>
            </div>
          </div>

          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">04</div>
              <h2>Accès au Site</h2>
            </div>
            <div class="card-body">
              <p>L'éditeur s'efforce de permettre l'accès au site 24 heures sur 24, 7 jours sur 7, sauf en cas de force majeure ou d'un événement hors du contrôle de Open Digital Services, et sous réserve des éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement du site et des services.</p>
            </div>
          </div>

          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">05</div>
              <h2>Modification des Conditions</h2>
            </div>
            <div class="card-body">
              <p>Open Digital Services se réserve la possibilité de modifier, à tout moment et sans préavis, les présentes conditions d'utilisation afin de les adapter aux évolutions du site et/ou de son exploitation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
    styleUrl: './terms.component.scss'
})
export class TermsComponent { }
