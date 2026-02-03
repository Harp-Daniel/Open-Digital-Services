import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../shared/services/services.service';
import { ContactService } from '../../shared/services/contact.service';
import { PartnerService } from '../../shared/services/partner.service';
import { TeamService } from '../../shared/services/team.service';
import { ProjectTrackingService } from '../../shared/services/project-tracking.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1 class="page-title">Tableau de bord</h1>
        <p class="page-subtitle">Bienvenue dans votre espace d'administration.</p>
      </header>
 
       <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-label">Équipe ODS</span>
            <div class="stat-icon icon-blue">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
          </div>
          <h3 class="stat-value">{{ teamCount() }}</h3>
          <p class="stat-info">Membres actifs</p>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-label">Nouveaux Messages</span>
            <div class="stat-icon icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <h3 class="stat-value">{{ unreadMessageCount() }}</h3>
          <p class="stat-info">Sur {{ totalMessageCount() }} messages au total</p>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-label">Partenaires</span>
            <div class="stat-icon icon-amber">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m5.84-5.841a14.927 14.927 0 0 1 2.58 5.841" />
              </svg>
            </div>
          </div>
          <h3 class="stat-value">{{ partnerCount() }}</h3>
          <p class="stat-info">{{ activeProjectCount() }} projets en cours</p>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-label">Services ODS</span>
            <div class="stat-icon icon-emerald">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <h3 class="stat-value">{{ serviceCount() }}</h3>
          <p class="stat-info">Catalogues d'expertises</p>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-label-with-reset">
              <span class="stat-label">Visiteurs</span>
              <button class="analytics-icon-btn" routerLink="/ods-management-portal-x9/analytics" title="Voir les statistiques détaillées">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </button>
              <button class="reset-icon-btn" (click)="openResetDialog()" title="Réinitialiser le compteur">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
            <div class="stat-icon icon-rose">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
          </div>
          <h3 class="stat-value">{{ visitorCount() }}</h3>
          <p class="stat-info">Total des visites</p>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-label">Abonnés</span>
            <div class="stat-icon icon-indigo">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5L12 14.5l-7-7" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
              </svg>
            </div>
          </div>
          <h3 class="stat-value">{{ subscriberCount() }}</h3>
          <p class="stat-info">Newsletter ODS</p>
        </div>
      </div>

       <!-- Main Section -->
      <div class="dashboard-grid">
         <!-- Recent Messages -->
        <div class="card messages-card">
          <div class="card-header">
            <h3 class="card-title">Derniers Messages</h3>
            <button routerLink="/ods-management-portal-x9/contacts" class="view-all-btn">Voir tout</button>
          </div>
          <div class="message-list">
            @for (msg of recentMessages(); track msg.id) {
              <div class="message-row" [class.unread]="msg.status === 'unread'">
                <div class="msg-avatar">
                  {{ msg.name.charAt(0) }}
                </div>
                <div class="msg-content">
                  <div class="msg-header">
                    <h4 class="msg-name">{{ msg.name }}</h4>
                    <span class="msg-date">{{ formatTime(msg.createdAt) }}</span>
                  </div>
                  <p class="msg-subject">{{ msg.subject }}</p>
                </div>
              </div>
            } @empty {
              <div class="empty-list">Aucun message pour le moment</div>
            }
          </div>
        </div>

         <!-- Quick Actions / Active Projects -->
        <div class="card projects-card">
          <h3 class="card-title">Projets à suivre</h3>
          <div class="project-list">
            @for (project of topActiveProjects(); track project.id) {
              <div class="project-item">
                <div class="project-info">
                  <span class="project-name">{{ project.name }}</span>
                  <span class="project-badge">
                    {{ project.progress }}%
                  </span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" [style.width.%]="project.progress"></div>
                </div>
              </div>
            } @empty {
                <div class="empty-list">Aucun projet actif</div>
            }
          </div>
          <button routerLink="/ods-management-portal-x9/partners" class="action-btn">
            Gérer les partenaires
          </button>
        </div>
      </div>

      <!-- Reset Confirmation Dialog -->
      @if (showResetDialog()) {
        <div class="dialog-overlay" (click)="closeResetDialog()">
          <div class="dialog-content" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <div class="dialog-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 class="dialog-title">Réinitialiser le compteur</h3>
              <button class="dialog-close" (click)="closeResetDialog()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="dialog-body">
              <p>Êtes-vous sûr de vouloir réinitialiser le compteur de visiteurs ?</p>
              <p class="dialog-warning">Cette action remettra le compteur à zéro et ne peut pas être annulée.</p>
            </div>
            <div class="dialog-footer">
              <button class="btn-cancel" (click)="closeResetDialog()" [disabled]="isResetting()">
                Annuler
              </button>
              <button class="btn-confirm" (click)="confirmReset()" [disabled]="isResetting()">
                @if (isResetting()) {
                  <span class="spinner"></span>
                  Réinitialisation...
                } @else {
                  Réinitialiser
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private servicesService = inject(ServicesService);
  private contactService = inject(ContactService);
  private partnerService = inject(PartnerService);
  private teamService = inject(TeamService);
  private analyticsService = inject(AnalyticsService);
  private trackingService = inject(ProjectTrackingService);

  serviceCount = signal(0);
  totalMessageCount = signal(0);
  unreadMessageCount = signal(0);
  partnerCount = signal(0);
  teamCount = signal(0);
  activeProjectCount = signal(0);
  visitorCount = signal(0);
  subscriberCount = signal(0);

  showResetDialog = signal(false);
  isResetting = signal(false);

  recentMessages = signal<any[]>([]);
  topActiveProjects = signal<any[]>([]);

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.servicesService.getServices().subscribe(res => {
      this.serviceCount.set(res.length);
    });

    this.contactService.getMessages().subscribe(res => {
      this.totalMessageCount.set(res.length);
      this.unreadMessageCount.set(res.filter(m => m.status === 'unread').length);
      this.recentMessages.set(res.slice(0, 5));
    });

    this.partnerService.getPartners().subscribe(res => {
      this.partnerCount.set(res.length);

      let projects: any[] = [];
      res.forEach(partner => {
        if (partner.projects) {
          partner.projects.forEach(p => {
            if (p.status !== 'Terminé') {
              projects.push({
                id: p.id || Math.random(),
                name: `${partner.name} - ${p.title}`,
                progress: p.progress
              });
            }
          });
        }
      });

      this.activeProjectCount.set(projects.length);
      this.topActiveProjects.set(projects.sort((a, b) => b.progress - a.progress).slice(0, 5));
    });

    this.teamService.getTeamMembers().subscribe(res => {
      this.teamCount.set(res.length);
    });

    this.analyticsService.getVisitorCount().subscribe(count => {
      this.visitorCount.set(count);
    });

    this.trackingService.getSubscribers().subscribe(res => {
      this.subscriberCount.set(res.length);
    });
  }

  formatTime(createdAt: any): string {
    if (!createdAt) return '';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `Il y a ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;

    return date.toLocaleDateString();
  }

  openResetDialog() {
    this.showResetDialog.set(true);
  }

  closeResetDialog() {
    this.showResetDialog.set(false);
  }

  confirmReset() {
    this.isResetting.set(true);
    this.analyticsService.resetVisitorCount().subscribe({
      next: () => {
        this.visitorCount.set(0);
        this.isResetting.set(false);
        this.showResetDialog.set(false);
      },
      error: (err) => {
        console.error('Error resetting visitor counter:', err);
        const errorMsg = err.error?.error || err.message || 'Erreur inconnue';
        const statusCode = err.status || 'N/A';
        alert(`Erreur lors de la réinitialisation du compteur.\nStatut: ${statusCode}\nMessage: ${errorMsg}`);
        this.isResetting.set(false);
        this.showResetDialog.set(false);
      }
    });
  }
}
