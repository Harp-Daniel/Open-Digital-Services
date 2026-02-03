import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="privacy-container">
      <section class="privacy-hero animate-in">
        <div class="hero-content">
          <span class="badge">Légal</span>
          <h1>Politique de <span>Confidentialité</span></h1>
          <p>Chez Open Digital Services, la protection de vos données est au cœur de notre engagement de transparence et de sécurité.</p>
          <div class="last-update">Dernière mise à jour : 22 Janvier 2026</div>
        </div>
      </section>

      <section class="privacy-content">
        <div class="content-wrapper">
          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">01</div>
              <h2>Collecte des Informations</h2>
            </div>
            <div class="card-body">
              <p>Nous collectons uniquement les informations nécessaires pour vous fournir nos services d'expertise numérique :</p>
              <ul>
                <li><strong>Informations d'identité</strong> : Nom et prénom pour les échanges professionnels.</li>
                <li><strong>Coordonnées</strong> : Adresse email et numéro de téléphone pour le suivi de vos projets.</li>
                <li><strong>Données techniques</strong> : Adresse IP et données de navigation via des cookies essentiels.</li>
              </ul>
            </div>
          </div>

          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">02</div>
              <h2>Utilisation de vos Données</h2>
            </div>
            <div class="card-body">
              <p>Vos données sont traitées sur la base de votre consentement pour les finalités suivantes :</p>
              <ul>
                <li>Réponse à vos demandes via nos formulaires de contact.</li>
                <li>Établissement et suivi des devis personnalisés.</li>
                <li>Maintenance de vos infrastructures et support technique.</li>
                <li>Amélioration de votre expérience sur notre plateforme.</li>
              </ul>
            </div>
          </div>

          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">03</div>
              <h2>Gestion des Cookies</h2>
            </div>
            <div class="card-body">
              <p>Nous utilisons des cookies pour optimiser les performances de notre site et analyser le trafic liquide. Vous avez le contrôle total sur ces derniers :</p>
              <ul>
                <li><strong>Cookies Essentiels</strong> : Indispensables au fonctionnement du site.</li>
                <li><strong>Cookies Analytiques</strong> : Pour comprendre comment vous utilisez notre site (Google Analytics).</li>
              </ul>
              <p class="note">Vous pouvez modifier vos préférences à tout moment via la bannière dédiée.</p>
            </div>
          </div>

          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">04</div>
              <h2>Sécurité et Conservation</h2>
            </div>
            <div class="card-body">
              <p>Vos données sont stockées sur des serveurs sécurisés et ne sont jamais vendues à des tiers. Nous les conservons uniquement pendant la durée nécessaire à la réalisation de nos prestations ou pour une durée légale maximale de 3 ans après notre dernier contact.</p>
            </div>
          </div>

          <div class="legal-card animate-in-scroll">
            <div class="card-header">
              <div class="number">05</div>
              <h2>Vos Droits</h2>
            </div>
            <div class="card-body">
              <p>Conformément au RGPD et aux lois locales, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande, contactez notre délégué à la protection des données :</p>
              <div class="contact-box">
                <p><strong>DPO Open Digital Services</strong></p>
                <p>Email : harpdaniel01@gmail.com</p>
                <p> Kinshasa, ville de Matadi/ RDC</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent { }
