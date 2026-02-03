import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService, ContactMessage } from '../../shared/services/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contacts-mgmt">
      <header class="dashboard-header">
        <div class="header-info">
          <h1 class="page-title">Messages de Contact</h1>
          <p class="page-subtitle">Consultez et gérez les demandes de vos clients.</p>
        </div>
      </header>
 
      <div class="table-container animate-in">
        <table class="contacts-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Sujet</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (msg of messages(); track msg.id) {
              <tr [class.unread]="msg.status === 'unread'">
                <td class="date-cell">
                  {{ msg.createdAt | date:'dd/MM/yy HH:mm' }}
                </td>
                <td>
                  <div class="client-info">
                    <span class="client-name">{{ msg.name }}</span>
                    <span class="client-email">{{ msg.email }}</span>
                  </div>
                </td>
                <td class="subject-cell">
                  <span class="subject-text">{{ msg.subject }}</span>
                  <span *ngIf="msg.status === 'unread'" class="badge-new">Nouveau</span>
                </td>
                <td>
                  <div class="message-preview" [title]="msg.message">{{ msg.message }}</div>
                </td>
                <td class="actions-cell">
                  <div class="actions-flex">
                    <button (click)="viewMessage(msg.id!)" class="action-btn view" title="Lire le message">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button *ngIf="msg.status === 'unread'" (click)="markAsRead(msg.id!)" class="action-btn read" title="Marquer comme lu">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                    <button (click)="deleteMessage(msg.id!)" class="action-btn delete" title="Supprimer">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
        
        <div *ngIf="messages().length === 0" class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          <p>Aucun message pour le moment.</p>
        </div>
      </div>

      <!-- Custom Confirmation Modal -->
      @if (confirmModal().isOpen) {
        <div class="modal-overlay animate-fade-in" (click)="closeConfirmModal()">
          <div class="modal-content confirmation-modal animate-zoom-in" (click)="$event.stopPropagation()">
            <div class="modal-icon-container danger">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div class="modal-body text-center">
              <h3>{{ confirmModal().title }}</h3>
              <p>{{ confirmModal().message }}</p>
            </div>
            <div class="modal-footer central">
              <button (click)="closeConfirmModal()" class="btn-secondary">Annuler</button>
              <button (click)="executeConfirmAction()" class="btn-primary btn-danger">
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './contacts-management.component.scss'
})
export class ContactsManagementComponent implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  messages = signal<ContactMessage[]>([]);

  // Confirmation Modal State
  confirmModal = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    action: (() => void) | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: null
  });

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.contactService.getMessages().subscribe(data => {
      this.messages.set(data);
    });
  }

  viewMessage(id: string) {
    this.router.navigate(['/ods-management-portal-x9/contacts', id]);
  }

  markAsRead(id: string) {
    this.contactService.markAsRead(id).subscribe();
  }

  deleteMessage(id: string) {
    this.confirmModal.set({
      isOpen: true,
      title: 'Supprimer le message',
      message: 'Voulez-vous vraiment supprimer ce message de contact ?',
      action: () => {
        this.contactService.deleteMessage(id).subscribe(() => {
          this.loadMessages();
          this.closeConfirmModal();
        });
      }
    });
  }

  closeConfirmModal() {
    this.confirmModal.update(state => ({ ...state, isOpen: false }));
  }

  executeConfirmAction() {
    if (this.confirmModal().action) {
      this.confirmModal().action!();
    }
  }
}
