import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TeamService, TeamMember } from '../../shared/services/team.service';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="team-mgmt">
      <header class="dashboard-header">
        <div class="header-info">
          <h1 class="page-title">Gestion de l'Équipe</h1>
          <p class="page-subtitle">Gérez les membres de votre équipe et leur visibilité publique.</p>
        </div>
        <button routerLink="/ods-management-portal-x9/team/new" class="btn-create">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un Membre
        </button>
      </header>

      @if (members().length > 0) {
        <div class="members-grid animate-in">
          @for (member of members(); track member.id) {
            <div class="business-card animate-in">
              <!-- Top Header -->
              <div class="card-header">
                <img src="images/logo.png" alt="ODS Logo" class="card-logo">
                <span class="company-name">Open Digital Services</span>
              </div>

              <!-- Content Body -->
              <div class="card-body">
                <div class="diagonal-line"></div>
                
                <div class="card-main">
                  <div class="avatar-side">
                    <div class="avatar-circle">
                      <img [src]="member.image || 'images/default-avatar.jpg'" [alt]="member.name">
                    </div>
                  </div>

                  <div class="info-side">
                    <div class="name-role">
                      <h3 class="member-name">{{ member.name }}</h3>
                      <p class="member-role">{{ member.role }}</p>
                    </div>

                    <p class="member-bio">{{ member.bio }}</p>

                    <ul class="contact-list">
                      @if (member.socials.email) {
                        <li>
                          <span class="bullet"></span>
                          {{ member.socials.email }}
                        </li>
                      }
                      @if (member.socials.linkedin) {
                        <li>
                          <span class="bullet"></span>
                          LinkedIn Profile
                        </li>
                      }
                      @if (member.socials.github) {
                        <li>
                          <span class="bullet"></span>
                          GitHub Portfolio
                        </li>
                      }
                      @if (member.socials.twitter) {
                        <li>
                          <span class="bullet"></span>
                          Twitter / X
                        </li>
                      }
                    </ul>
                  </div>
                </div>

                <div class="status-indicator" [class.published]="member.isPublished">
                  {{ member.isPublished ? 'PUBLIÉ' : 'BROUILLON' }}
                </div>
              </div>

              <!-- Admin Actions Overlay -->
              <div class="admin-actions">
                <button (click)="editMember(member.id!)" class="action-btn edit" title="Modifier">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.89 1.07l-2.68.803 1.07-2.681a4.5 4.5 0 0 1 1.07-1.89l12.45-12.45ZM16.862 4.487 19.5 7.125" />
                  </svg>
                </button>
                <button (click)="deleteMember(member.id!)" class="action-btn delete" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.34 9m-4.78 0-.34-9m9.26-3.48L18.91 3H5.09L3.48 5.52m15.52 0c.51 0 .9.41.9.91v.1c0 .26-.1.51-.29.69l-.31.32M5.09 5.52c-.51 0-.91.41-.91.91v.1c0 .26.1.51.29.69l.31.32m12.72 0H6.18" />
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state animate-in">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.968-1.584A6.062 6.062 0 016 18.719m12 0a5.998 5.998 0 00-12 0m12 0a5.998 5.998 0 00-12 0m8-4.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18 8.75V1.75m-3 3h6" />
            </svg>
          </div>
          <h3>Aucun membre d'équipe</h3>
          <p>Commencez par ajouter les talents qui font la force de votre entreprise.</p>
          <button routerLink="/ods-management-portal-x9/team/new" class="btn-create">Ajouter votre premier membre</button>
        </div>
      }

      <!-- Confirmation Modal -->
      @if (confirmModal().isOpen) {
        <div class="modal-overlay" (click)="closeConfirmModal()">
          <div class="confirmation-modal animate-in" (click)="$event.stopPropagation()">
            <div class="modal-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3>Confirmer la suppression</h3>
            <p>Voulez-vous vraiment retirer ce membre de l'équipe ? Cette action est irréversible.</p>
            <div class="modal-footer">
              <button (click)="closeConfirmModal()" class="btn-secondary">Annuler</button>
              <button (click)="executeDelete()" class="btn-danger">Supprimer</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent implements OnInit {
  private teamService = inject(TeamService);
  private router = inject(Router);

  members = signal<TeamMember[]>([]);
  confirmModal = signal({ isOpen: false, memberId: '' });

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.teamService.getTeamMembers().subscribe(data => {
      this.members.set(data);
    });
  }

  editMember(id: string) {
    this.router.navigate(['/ods-management-portal-x9/team/edit', id]);
  }

  deleteMember(id: string) {
    this.confirmModal.set({ isOpen: true, memberId: id });
  }

  closeConfirmModal() {
    this.confirmModal.set({ isOpen: false, memberId: '' });
  }

  executeDelete() {
    const id = this.confirmModal().memberId;
    if (id) {
      this.teamService.deleteMember(id).subscribe(() => {
        this.loadMembers();
        this.closeConfirmModal();
      });
    }
  }
}
