import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../shared/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-container">
      <section class="contact-hero animate-in">
        <div class="hero-content">
          <h1>Parlons de votre <span>Projet</span></h1>
          <p>Nous sommes là pour répondre à vos questions et transformer vos idées en réalité numérique.</p>
        </div>
      </section>

      <section class="contact-grid animate-in-scroll">
        <div class="contact-info animate-in-right">
          <div class="info-card">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.166-5.122-3.464-6.288-6.288l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div class="details">
              <h4>Téléphone</h4>
              <p>+243 841 060 706</p>
              <span>Lundi - Vendredi, 8h - 17h</span>
            </div>
          </div>

          <div class="info-card">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div class="details">
              <h4>Email</h4>
              <p>contact@odssolutions.com</p>
              <span>Réponse sous 24 heures</span>
            </div>
          </div>

          <div class="info-card">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div class="details">
              <h4>Localisation</h4>
              <p>Kinshasa, RDC</p>
              <span>Province du Kongo-Central, Matadi</span>
            </div>
          </div>
        </div>

        <form class="contact-form animate-in-left" (submit)="onSubmit($event)">
          <div class="form-group">
            <label>Nom Complet</label>
            <input type="text" [(ngModel)]="formData.name" name="name" placeholder="Votre nom complet" required>
          </div>
          <div class="form-group">
            <label>Email Professionnel</label>
            <input type="email" [(ngModel)]="formData.email" name="email" placeholder="Votre adresse email" required>
          </div>
          <div class="form-group">
            <label>Sujet</label>
            <select [(ngModel)]="formData.subject" name="subject" required>
              <option value="Développement Web">Développement Web</option>
              <option value="Installation Caméra">Installation Caméra</option>
              <option value="Réseau Informatique">Réseau Informatique</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea [(ngModel)]="formData.message" name="message" rows="5" placeholder="Décrivez votre besoin..." required></textarea>
          </div>
          <div class="form-group" style="display: none !important;">
            <label>Ne pas remplir</label>
            <input type="text" [(ngModel)]="formData.honeypot" name="honeypot" autocomplete="off">
          </div>
          <button type="submit" class="btn-primary" [disabled]="isSending()">
            {{ isSending() ? 'Envoi en cours...' : 'Envoyer le Message' }}
          </button>
        </form>
      </section>
    </div>

    <!-- Success Modal -->
    <div class="modal-overlay" *ngIf="showSuccessModal()" (click)="closeModal()">
      <div class="modal-content animate-pop" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2>Merci !</h2>
        </div>
        <div class="modal-body">
          <p>Votre message a été envoyé avec succès.</p>
          <p>Notre équipe vous contactera dans les plus brefs délais.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" (click)="closeModal()">Fermer</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private contactService = inject(ContactService);

  isSending = signal(false);
  showSuccessModal = signal(false);

  formData = {
    name: '',
    email: '',
    subject: 'Développement Web',
    message: '',
    honeypot: ''
  };

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.isSending()) return;

    this.isSending.set(true);
    this.contactService.createMessage(this.formData).subscribe({
      next: () => {
        this.showSuccessModal.set(true);
        this.formData = {
          name: '',
          email: '',
          subject: 'Développement Web',
          message: '',
          honeypot: ''
        };
        this.isSending.set(false);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
        this.isSending.set(false);
      }
    });
  }

  closeModal() {
    this.showSuccessModal.set(false);
  }
}
