import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProjectTrackingService, Subscriber } from '../../shared/services/project-tracking.service';

@Component({
  selector: 'app-subscriber-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="subscriber-details-container">
      <header class="page-header">
        <div class="header-left">
          <button routerLink="/ods-management-portal-x9/partners" class="btn-back-circle" title="Retour à la gestion">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div class="header-titles">
            <h1 class="page-title">Détails de l'Abonné</h1>
            <nav class="breadcrumb">Admin <span class="sep">/</span> Partenaires <span class="sep">/</span> Abonné</nav>
          </div>
        </div>
        
        <div class="header-actions">
           @if (subscriber()) {
             <button (click)="deleteSubscriber(subscriber()!.id)" class="btn-icon-delete" title="Supprimer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.34 9m-4.78 0-.34-9m9.26-3.48L18.91 3H5.09L3.48 5.52m15.52 0c.51 0 .9.41.9.91v.1c0 .26-.1.51-.29.69l-.31.32M5.09 5.52c-.51 0-.91.41-.91.91v.1c0 .26.1.51.29.69l.31.32m12.72 0H6.18" />
                </svg>
             </button>
           }
        </div>
      </header>

      @if (subscriber(); as sub) {
        <div class="subscriber-wrapper animate-in">
          <div class="detail-main">
            <!-- Sidebar info -->
            <aside class="client-sidebar">
              <div class="sidebar-inner">
                <div class="client-avatar">
                  {{ sub.email.substring(0, 1).toUpperCase() }}
                </div>
                <div class="client-core">
                  <h2 class="client-name">Abonné Open Digital</h2>
                  <a [href]="'mailto:' + sub.email" class="client-email">{{ sub.email }}</a>
                </div>
                
                <div class="meta-info">
                  <div class="meta-item">
                    <label>Date d'inscription</label>
                    <span>{{ sub.subscribedAt | date:'dd MMMM yyyy' }}</span>
                    <small>{{ sub.subscribedAt | date:'HH:mm' }}</small>
                  </div>
                  <div class="meta-item">
                    <label>Statut</label>
                    <span class="status-pill active">
                      Actif
                    </span>
                  </div>
                </div>

                <div class="shortcuts">
                  <a [href]="'mailto:' + sub.email" class="btn-reply">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Répondre par email
                  </a>
                </div>
              </div>
            </aside>

            <!-- Main content -->
            <article class="subscriber-body">
              <div class="body-inner">
                <div class="info-section">
                  <label>À propos</label>
                  <p class="info-text">
                    Cet utilisateur s'est inscrit à la newsletter "Open Digital Club" pour recevoir nos actualités exclusives et profiter d'avantages réservés aux membres.
                  </p>
                </div>

                <div class="info-section">
                  <label>Informations</label>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Email</span>
                      <span class="info-value">{{ sub.email }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Date d'inscription</span>
                      <span class="info-value">{{ sub.subscribedAt | date:'medium' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">ID Système</span>
                      <span class="info-value mono">{{ sub.id }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      } @else if (loading()) {
        <div class="state-container">
          <div class="loader"></div>
          <p>Chargement des informations...</p>
        </div>
      } @else {
        <div class="state-container error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p>Désolé, l'abonné est introuvable.</p>
          <button routerLink="/ods-management-portal-x9/partners" class="btn-back-link">Retour à la gestion</button>
        </div>
      }

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
  styles: [`
    @use 'sass:color';
    @use '../../../_variables' as *;

    .subscriber-details-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem;

      @media (min-width: 768px) {
        padding: 1.5rem;
      }
      
      @media (min-width: 1024px) {
        padding: 2rem;
      }
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;

      .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .btn-back-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgba(0,0,0,0.05);
        background: white;
        @include flex-center;
        color: $light-text;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;

        &:hover {
          background: $light-surface;
          transform: translateX(-4px);
          border-color: $light-secondary;
          color: $light-secondary;
        }

        svg { width: 20px; height: 20px; }
      }

      .header-titles {
        .page-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: $light-text;
          margin: 0;
          @media (max-width: 500px) { font-size: 1.25rem; }
        }

        .breadcrumb {
          font-size: 0.75rem;
          color: $light-text-soft;
          display: flex;
          gap: 0.4rem;
          margin-top: 0.25rem;
          .sep { opacity: 0.3; }
        }
      }

      .btn-icon-delete {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgba(239, 68, 68, 0.05);
        border: 1px solid rgba(239, 68, 68, 0.1);
        color: #ef4444;
        cursor: pointer;
        @include flex-center;
        transition: all 0.2s ease;

        &:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.05);
        }
        svg { width: 20px; height: 20px; }
      }
    }

    .subscriber-wrapper {
      .detail-main {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 992px) {
          grid-template-columns: 350px minmax(0, 1fr);
          align-items: start;
        }
      }
    }

    .client-sidebar {
      .sidebar-inner {
        background: white;
        border-radius: 1.25rem;
        padding: 1.5rem;
        border: 1px solid rgba(0,0,0,0.05);
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        @media (min-width: 768px) {
          padding: 2rem;
          border-radius: 1.5rem;
        }
      }

      .client-avatar {
        width: 80px;
        height: 80px;
        border-radius: 2rem;
        background: linear-gradient(135deg, $light-secondary, color.adjust($light-secondary, $lightness: -10%));
        color: white;
        @include flex-center;
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 20px rgba($light-secondary, 0.2);
      }

      .client-name {
        font-size: 1.5rem;
        font-weight: 800;
        color: $light-text;
        margin: 0 0 0.5rem;
      }

      .client-email {
        font-size: 0.9375rem;
        color: $light-secondary;
        text-decoration: none;
        word-break: break-all;
        font-weight: 600;
        &:hover { text-decoration: underline; }
      }

      .meta-info {
        width: 100%;
        margin: 2rem 0;
        padding-top: 2rem;
        border-top: 1px solid rgba(0,0,0,0.05);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        text-align: left;

        @media (min-width: 992px) {
          grid-template-columns: 1fr;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;

          label {
            font-size: 0.7rem;
            font-weight: 800;
            color: $light-text-soft;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          span { font-weight: 700; color: $light-text; font-size: 0.9375rem; }
          small { font-size: 0.8rem; color: $light-text-soft; }

          .status-pill {
            display: inline-block;
            padding: 0.35rem 0.75rem;
            background: #f1f5f9;
            border-radius: 2rem;
            font-size: 0.75rem;
            text-align: center;
            &.active { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
          }
        }
      }

      .shortcuts {
        width: 100%;
        .btn-reply {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem;
          background: $light-primary;
          color: white;
          border-radius: 1rem;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.2s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba($light-primary, 0.3);
          }
          svg { width: 18px; height: 18px; }
        }
      }
    }

    .subscriber-body {
      .body-inner {
        background: white;
        border-radius: 1.25rem;
        padding: 1.25rem;
        border: 1px solid rgba(0,0,0,0.05);
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        @media (min-width: 768px) {
          padding: 2.5rem;
          gap: 2.5rem;
          border-radius: 1.5rem;
        }
        min-width: 0;
      }

      label {
        display: block;
        font-size: 0.75rem;
        font-weight: 800;
        color: $light-text-soft;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.75rem;
      }

      .info-text {
        font-size: 1rem;
        line-height: 1.6;
        color: $light-text;
        background: $light-surface;
        padding: 1.25rem;
        border-radius: 1rem;
        margin: 0;
        border-left: 4px solid $light-secondary;

        @media (min-width: 768px) { 
            padding: 2rem; 
            font-size: 1.125rem; 
            line-height: 1.8;
            border-radius: 1.5rem;
        }
      }

      .info-grid {
        display: grid;
        gap: 1.5rem;
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: $light-surface;
          border-radius: 0.75rem;

          .info-label {
            font-size: 0.75rem;
            font-weight: 700;
            color: $light-text-soft;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .info-value {
            font-size: 1rem;
            font-weight: 600;
            color: $light-text;
            word-break: break-all;

            &.mono {
              font-family: 'Courier New', monospace;
              font-size: 0.875rem;
            }
          }
        }
      }
    }

    .state-container {
      padding: 5rem 2rem;
      text-align: center;
      background: white;
      border-radius: 2rem;
      border: 1px solid rgba(0,0,0,0.05);
      @include flex-center;
      flex-direction: column;
      gap: 1.5rem;

      &.error {
        color: #ef4444;
        svg { width: 64px; height: 64px; opacity: 0.5; }
      }

      .loader {
        width: 48px;
        height: 48px;
        border: 4px solid #f1f5f9;
        border-top-color: $light-secondary;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .btn-back-link {
        padding: 0.75rem 1.5rem;
        background: $light-primary;
        color: white;
        border: none;
        border-radius: 0.75rem;
        font-weight: 600;
        cursor: pointer;
      }
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    
    .animate-in {
      animation: fadeIn 0.5s ease forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Dark Mode */
    :host-context(.dark) {
      .page-header {
        .btn-back-circle {
          background: #1e293b;
          border-color: rgba(255,255,255,0.05);
          color: $dark-text;
          &:hover { background: #334155; color: $dark-secondary; }
        }
        .page-title { color: $dark-text; }
        .breadcrumb { color: $dark-text-soft; }
        .btn-icon-delete { background: rgba(239, 68, 68, 0.1); }
      }

      .client-sidebar .sidebar-inner, 
      .subscriber-body .body-inner {
        background: #1e293b;
        border-color: rgba(255,255,255,0.05);
      }

      .client-sidebar {
        .client-name { color: $dark-text; }
        .client-email { color: $dark-secondary; }
        .meta-info {
          border-top-color: rgba(255,255,255,0.05);
          .meta-item {
            label { color: $dark-text-soft; }
            span { color: $dark-text; }
            .status-pill { background: rgba(255,255,255,0.05); color: $dark-text-soft; }
            .status-pill.active { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
          }
        }
        .btn-reply { background: $dark-secondary; color: #0f172a; }
      }

      .subscriber-body {
        .info-text {
          background: #0f172a;
          color: $dark-text;
          border-left-color: $dark-secondary;
        }

        .info-grid .info-item {
          background: #0f172a;
          
          .info-label { color: $dark-text-soft; }
          .info-value { color: $dark-text; }
        }
      }

      .state-container {
        background: #1e293b;
        border-color: rgba(255,255,255,0.05);
        color: $dark-text;
      }
    }
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1rem;
    }

    .modal-content.confirmation-modal {
      background: white;
      width: 100%;
      max-width: 400px;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

      .modal-icon-container {
        width: 64px;
        height: 64px;
        background: #fef2f2;
        color: #ef4444;
        border-radius: 50%;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        svg { width: 32px; height: 32px; }
      }

      h3 { font-size: 1.25rem; font-weight: 800; color: $light-text; margin-bottom: 0.5rem; text-align: center; }
      p { color: $light-text-soft; font-size: 0.9375rem; line-height: 1.5; margin-bottom: 1.5rem; text-align: center; }

      .modal-footer.central {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;

        button {
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary { background: #f1f5f9; border: none; color: $light-text; &:hover { background: #e2e8f0; } }
        .btn-primary.btn-danger { background: #ef4444; border: none; color: white; &:hover { filter: brightness(1.1); } }
      }
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .animate-zoom-in { animation: zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }

    /* Dark Mode */
    :host-context(.dark) {
      .modal-content.confirmation-modal {
        background: #1e293b;
        h3 { color: white; }
        p { color: $dark-text-soft; }
        .modal-icon-container { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .btn-secondary { background: #334155; color: white; }
      }
    }
  `]
})
export class SubscriberDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trackingService = inject(ProjectTrackingService);

  subscriber = signal<Subscriber | null>(null);
  loading = signal(true);

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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSubscriber(id);
    }
  }

  loadSubscriber(id: string) {
    this.trackingService.getSubscribers().subscribe(subscribers => {
      const sub = subscribers.find(s => s.id === id);
      if (sub) {
        this.subscriber.set(sub);
        this.loading.set(false);
      } else {
        this.loading.set(false);
      }
    });
  }

  deleteSubscriber(id: string) {
    this.confirmModal.set({
      isOpen: true,
      title: 'Supprimer l\'abonné',
      message: 'Voulez-vous vraiment retirer cet abonné de la liste ?',
      action: () => {
        this.trackingService.deleteSubscriber(id).subscribe(() => {
          this.router.navigate(['/ods-management-portal-x9/partners']);
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
