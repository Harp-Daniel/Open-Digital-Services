import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartnerService, Partner, Project, ProjectHistory, ProjectStages } from '../../shared/services/partner.service';
import { ProjectTrackingService, Subscriber } from '../../shared/services/project-tracking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partners-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="partners-mgmt">
      <header class="dashboard-header">
        <div class="header-info">
          <h1 class="page-title">Administration des Partenaires</h1>
          <p class="page-subtitle">Gérez vos clients et l'évolution de leurs projets numériques.</p>
        </div>
        <button (click)="openPartnerModal()" class="btn-create">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau Partenaire
        </button>
      </header>

      <!-- Partners Table Section -->
      <section class="partners-section">
        <!-- Mobile View (Cards) -->
        <div class="mobile-partner-cards">
          @for (partner of partners(); track partner.id) {
            <div class="partner-card">
              <header class="card-header">
                <div class="partner-identity">
                  <div class="partner-avatar">{{ partner.name.charAt(0) }}</div>
                  <div class="partner-main">
                    <span class="partner-name">{{ partner.name }}</span>
                    <span class="order-badge">{{ partner.orderNumber }}</span>
                  </div>
                </div>
                <div class="partner-actions">
                  <button (click)="openPartnerModal(partner)" class="action-btn edit" title="Modifier">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button (click)="deletePartner(partner.id!)" class="action-btn delete" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.34 9m-4.78 0-.34-9m9.26-3.48L18.91 3H5.09L3.48 5.52m15.52 0c.51 0 .9.41.9.91v.1c0 .26-.1.51-.29.69l-.31.32M5.09 5.52c-.51 0-.91.41-.91.91v.1c0 .26.1.51.29.69l.31.32m12.72 0H6.18" />
                    </svg>
                  </button>
                </div>
              </header>

              <div class="card-content">
                <div class="contact-info">
                  <span class="email">{{ partner.email }}</span>
                </div>

                <div class="projects-mini-list">
                  @if (partner.projects.length > 0) {
                    <div class="mobile-projects">
                      @for (project of partner.projects; track project.id; let i = $index) {
                        <div class="project-item-compact">
                          <div class="proj-header">
                            <span class="proj-title">{{ project.title }}</span>
                            <span class="status-badge" [attr.data-status]="project.status">{{ project.status }}</span>
                          </div>
                          <div class="proj-progress-row">
                            <div class="mini-progress">
                              <div class="fill" [style.width.%]="project.progress"></div>
                            </div>
                            <span class="pct">{{ project.progress }}%</span>
                          </div>
                          <div class="proj-actions-compact">
                            <button (click)="editProject(partner, project, i)" class="btn-mini-compact">✏️</button>
                            <button (click)="deleteProject(partner, project, i)" class="btn-mini-compact btn-danger">🗑️</button>
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <p class="no-projects">Aucun projet en cours</p>
                  }
                  <button (click)="openProjectModal(partner)" class="btn-add-inline-compact">
                    + Ajouter un projet
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Desktop View (Table) -->
        <div class="table-container shadow-sm desktop-only">
          <table class="partners-table">
            <thead>
              <tr>
                <th>Client / Entreprise</th>
                <th>Contact & Commande</th>
                <th>Projets</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (partner of partners(); track partner.id) {
                <tr class="partner-row">
                  <td class="client-cell">
                    <div class="partner-info">
                      <div class="partner-avatar">{{ partner.name.charAt(0) }}</div>
                      <span class="partner-name">{{ partner.name }}</span>
                    </div>
                  </td>
                  <td class="meta-cell">
                    <div class="meta-info">
                      <span class="email">{{ partner.email }}</span>
                      <span class="order-badge">{{ partner.orderNumber }}</span>
                    </div>
                  </td>
                  <td class="projects-cell">
                    <div class="projects-mini-list">
                      @if (partner.projects.length > 0) {
                        <table class="projects-table-inner">
                          <thead>
                            <tr>
                              <th>Projet</th>
                              <th>Progrès</th>
                              <th>Statut</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (project of partner.projects; track project.id; let i = $index) {
                              <tr>
                                <td class="project-title">{{ project.title }}</td>
                                <td class="project-progress">
                                  <div class="mini-progress-container"> <!-- Added missing container class -->
                                    <div class="mini-progress">
                                      <div class="fill" [style.width.%]="project.progress"></div>
                                    </div>
                                    <span class="pct">{{ project.progress }}%</span>
                                  </div>
                                </td>
                                <td><span class="status-badge" [attr.data-status]="project.status">{{ project.status }}</span></td>
                                <td class="project-actions">
                                  <button (click)="editProject(partner, project, i)" class="btn-mini" title="Modifier le projet">✏️</button>
                                  <button (click)="deleteProject(partner, project, i)" class="btn-mini btn-danger-mini" title="Supprimer le projet">🗑️</button>
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      } @else {
                        <span class="no-projects">Aucun projet</span>
                      }
                      <button (click)="openProjectModal(partner)" class="btn-add-inline">
                        + Ajouter un projet
                      </button>
                    </div>
                  </td>
                  <td class="actions-cell text-right">
                    <div class="partner-actions-btns">
                      <button (click)="openPartnerModal(partner)" class="btn-icon" title="Modifier le partenaire">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button (click)="deletePartner(partner.id!)" class="btn-icon btn-delete" title="Supprimer le partenaire">
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
      </section>

      <!-- Subscribers Section -->
      <section class="subscribers-section mt-5">
        <header class="section-header">
          <div class="header-main">
            <h2 class="section-title">Gestion des Abonnés</h2>
            <p class="section-subtitle">Gérez les membres inscrits à la newsletter ({{ subscribers().length }} abonnés).</p>
          </div>
          <button (click)="loadSubscribers()" class="btn-refresh" title="Rafraîchir la liste">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-refresh">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </header>

        <!-- Unified Responsive Table for Subscribers -->
        <div class="table-container shadow-sm">
          <table class="data-table">
            <thead>
              <tr>
                <th>Email de l'Abonné</th>
                <th class="desktop-only text-center">Date d'inscription</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (sub of subscribers(); track sub.id) {
                <tr>
                  <td>
                    <div class="sub-cell">
                      <div class="dot"></div>
                      <div class="sub-info">
                        <span class="email">{{ sub.email }}</span>
                        <span class="date mobile-only">{{ sub.subscribedAt | date:'dd/MM/yyyy' }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="desktop-only text-center">{{ sub.subscribedAt | date:'medium' }}</td>
                  <td class="text-right">
                    <div class="action-btns">
                      <button (click)="replyToSubscriber(sub.id)" class="btn-icon-alt" title="Répondre">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1.25rem;">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      </button>
                      <button (click)="deleteSubscriber(sub.id)" class="btn-icon-alt btn-delete-alt" title="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 1.25rem;">
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
      </section>

      <!-- Custom Confirmation Modal -->
      @if (confirmModal().isOpen) {
        <div class="modal-overlay animate-fade-in" (click)="closeConfirmModal()">
          <div class="modal-content confirmation-modal animate-zoom-in" (click)="$event.stopPropagation()">
            <div class="modal-icon-container" [class.danger]="confirmModal().type === 'danger'">
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
              <button (click)="executeConfirmAction()" class="btn-primary" [class.btn-danger]="confirmModal().type === 'danger'">
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styleUrl: './partners-management.component.scss'
})
export class PartnersManagementComponent implements OnInit {
  private partnerService = inject(PartnerService);
  private trackingService = inject(ProjectTrackingService);
  private router = inject(Router);

  // State variables for partners and subscribers
  partners = signal<Partner[]>([]);
  subscribers = signal<Subscriber[]>([]);

  // Confirmation Modal State
  confirmModal = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'info';
    action: (() => void) | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    action: null
  });

  ngOnInit() {
    this.loadPartners();
    this.loadSubscribers();
  }

  loadPartners() {
    this.partnerService.getPartners().subscribe(data => {
      this.partners.set(data);
    });
  }

  loadSubscribers() {
    this.trackingService.getSubscribers().subscribe(data => {
      this.subscribers.set(data);
    });
  }

  openPartnerModal(partner?: Partner) {
    if (partner) {
      this.router.navigate(['/ods-management-portal-x9/partners/edit', partner.id]);
} else {
  this.router.navigate(['/ods-management-portal-x9/partners/new']);
    }
  }

  openProjectModal(partner: Partner) {
    this.router.navigate(['/ods-management-portal-x9/partners/edit', partner.id], {
      queryParams: { addProject: 'true' }
    });
}

editProject(partner: Partner, project: Project, index: number) {
  this.router.navigate(['/ods-management-portal-x9/partners/edit', partner.id], {
    queryParams: { editProjectIndex: index }
  });
  }

  deleteProject(partner: Partner, project: Project, index: number) {
    this.confirmModal.set({
      isOpen: true,
      title: 'Supprimer le projet',
      message: `Êtes-vous sûr de vouloir supprimer le projet "${project.title}" ? Cette action est irréversible.`,
      type: 'danger',
      action: () => {
        const updatedProjects = partner.projects.filter((_, i) => i !== index);
        this.partnerService.updatePartner(partner.id!, { projects: updatedProjects }).subscribe(() => {
          this.loadPartners();
          this.closeConfirmModal();
        });
      }
    });
  }

  deletePartner(id: string) {
    this.confirmModal.set({
      isOpen: true,
      title: 'Supprimer le partenaire',
      message: 'Voulez-vous vraiment supprimer ce partenaire et tous ses projets associés ?',
      type: 'danger',
      action: () => {
        this.partnerService.deletePartner(id).subscribe(() => {
          this.loadPartners();
          this.closeConfirmModal();
        });
      }
    });
  }

  // Subscriber actions
  replyToSubscriber(subscriberId: string) {
    this.router.navigate(['/ods-management-portal-x9/subscribers', subscriberId]);
  }

  deleteSubscriber(id: string) {
    this.confirmModal.set({
      isOpen: true,
      title: 'Supprimer l\'abonné',
      message: 'Voulez-vous vraiment retirer cet email de la liste de diffusion ?',
      type: 'danger',
      action: () => {
        this.trackingService.deleteSubscriber(id).subscribe(() => {
          this.loadSubscribers();
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
