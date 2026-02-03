import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ServicesService, ServiceItem } from '../../shared/services/services.service';

@Component({
  selector: 'app-services-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="services-mgmt">
      <header class="dashboard-header">
        <div class="header-info">
          <h1 class="page-title">Gestion des Services</h1>
          <p class="page-subtitle">Ajoutez, modifiez ou supprimez vos expertises.</p>
        </div>
        <button routerLink="/ods-management-portal-x9/services/new" class="btn-create">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau Service
        </button>
      </header>

      <!-- Services Table -->
      <div class="table-container animate-in">
        <table class="services-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (service of services(); track service.id) {
              <tr>
                <td>
                  <div class="service-info-cell">
                    <img [src]="service.image" [alt]="service.title" class="service-img-mini">
                    <span class="service-title-text">{{ service.title }}</span>
                  </div>
                </td>
                <td>
                  <span class="category-badge">{{ service.category }}</span>
                </td>
                <td>
                  <div class="description-cell">{{ service.description }}</div>
                </td>
                <td>
                  <div class="tags-list">
                    @for (tag of service.tags; track tag) {
                      <span class="tag">{{ tag }}</span>
                    }
                  </div>
                </td>
                <td class="actions-cell">
                  <div class="actions-flex">
                    <button (click)="editService(service.id!)" class="action-btn edit" title="Modifier">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.89 1.07l-2.68.803 1.07-2.681a4.5 4.5 0 0 1 1.07-1.89l12.45-12.45ZM16.862 4.487 19.5 7.125" />
                      </svg>
                    </button>
                    <button (click)="deleteService(service.id!)" class="action-btn delete" title="Supprimer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.34 9m-4.78 0-.34-9m9.26-3.48L18.91 3H5.09L3.48 5.52m15.52 0c.51 0 .9.41.9.91v.1c0 .26-.1.51-.29.69l-.31.32M5.09 5.52c-.51 0-.91.41-.91.91v.1c0 .26.1.51.29.69l.31.32m12.72 0H6.18" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
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
  styleUrl: './services-management.component.scss'
})
export class ServicesManagementComponent implements OnInit {
  private servicesService = inject(ServicesService);
  private router = inject(Router);

  services = signal<ServiceItem[]>([]);

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
    this.loadServices();
  }

  loadServices() {
    this.servicesService.getServices().subscribe(data => {
      this.services.set(data);
    });
  }

  editService(id: string) {
    this.router.navigate(['/ods-management-portal-x9/services/edit', id]);
  }

  deleteService(id: string) {
    this.confirmModal.set({
      isOpen: true,
      title: 'Supprimer le service',
      message: 'Voulez-vous vraiment supprimer ce service ? Cette action est définitive.',
      action: () => {
        this.servicesService.deleteService(id).subscribe({
          next: () => {
            this.loadServices();
            this.closeConfirmModal();
          },
          error: (err) => {
            console.error(err);
            alert('Erreur lors de la suppression : ' + (err.message || 'Erreur inconnue'));
            this.closeConfirmModal();
          }
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
