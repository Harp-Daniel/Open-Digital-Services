import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-container">
      <section class="faq-hero animate-in">
        <div class="hero-content">
          <h1>Questions <span>Fréquentes</span></h1>
          <p>Tout ce que vous devez savoir sur nos services et notre façon de travailler.</p>
        </div>
      </section>

      <section class="faq-accordion animate-in-scroll">
        <div class="accordion-container">
          @for (item of faqs; track $index) {
            <div class="faq-item" [class.open]="activeIndex() === $index">
              <button class="faq-question" (click)="toggle($index)">
                {{ item.question }}
                <span class="icon"></span>
              </button>
              <div class="faq-answer">
                <div class="answer-content">
                  {{ item.answer }}
                </div>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  activeIndex = signal<number | null>(0);

  faqs = [
    {
      question: "Quels sont vos délais pour la création d'un site web ?",
      answer: "Les délais dépendent de la complexité du projet. En moyenne, un site vitrine est livré en 2 à 4 semaines, tandis qu'une application web complexe peut prendre 2 à 4 mois."
    },
    {
      question: "Proposez-vous un support après l'installation des caméras ?",
      answer: "Absolument. Nous incluons une garantie de maintenance de 12 mois pour chaque installation, incluant les mises à jour logicielles et le support technique prioritaire."
    },
    {
      question: "Intervenez-vous en dehors de Kinshasa ?",
      answer: "Oui, notre équipe se déplace dans toutes les provinces de la RDC et en dehors du pays, selon le contrat avec nos partenaires."
    },
    {
      question: "Comment fonctionne votre service de maintenance IT ?",
      answer: "Nous proposons des contrats mensuels ou annuels. Cela inclut le monitoring à distance, les visites préventives et l'assistance en cas de panne critique."
    }
  ];

  toggle(index: number) {
    this.activeIndex.set(this.activeIndex() === index ? null : index);
  }
}
