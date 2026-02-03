import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PartnerService, Partner, Project } from '../../shared/services/partner.service';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-partner-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="editor-container" [class.sidebar-collapsed]="sidebarService.isCollapsed()">
      <header class="editor-header">
        <div class="header-content">
          <button routerLink="/ods-management-portal-x9/partners" class="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour
          </button>
          <h1 class="page-title">
            {{ !isEdit ? 'Nouveau Partenaire' : (isAddingProject ? 'Nouveau Projet' : (editProjectIndex !== null ? 'Modifier Projet' : 'Éditer Partenaire')) }}
          </h1>
        </div>
      </header>

      <form (ngSubmit)="save()" class="editor-form">
        <div class="form-grid" [class.single-column]="isIdentityOnly || isProjectOnly">
          <!-- Partner Info -->
          @if (showIdentitySection) {
            <section class="form-section" [class.full-width]="isIdentityOnly">
            <h2 class="section-title">Identité du Partenaire</h2>
            @if (isEdit && (isAddingProject || editProjectIndex !== null)) {
              <div class="alert-info">
                Les informations du partenaire sont partagées par tous ses projets.
              </div>
            }
            <div class="input-group">
              <label>Nom du client / Entreprise</label>
              <input type="text" [(ngModel)]="partner.name" name="name" required placeholder="Ex: Jean Dupont" [disabled]="isEdit && (isAddingProject || editProjectIndex !== null)">
            </div>
            <div class="input-group">
              <label>Email de contact (Unique)</label>
              <input type="email" [(ngModel)]="partner.email" name="email" required placeholder="Ex: jean.dupont@pro.com" [disabled]="isEdit && (isAddingProject || editProjectIndex !== null)">
            </div>
            <div class="input-group">
              <label>Numéro de commande / Contrat</label>
              <input type="text" [(ngModel)]="partner.orderNumber" name="orderNumber" required placeholder="Ex: ODS-2024-001" [disabled]="isEdit && (isAddingProject || editProjectIndex !== null)">
            </div>
            @if (isEdit && !isProjectOnly) {
              <p class="helper-text">Identité partagée par tous les projets de ce partenaire.</p>
            }
          </section>
          }

          <!-- Project Section -->
          @if (showProjectSection) {
          <section class="form-section full-width">
              <div class="section-header-flex">
                <h2 class="section-title">{{ isAddingProject ? 'Configuration du Nouveau Projet' : (editProjectIndex !== null ? 'Modification du Projet' : 'Projet Principal') }}</h2>
                <span class="badge" *ngIf="isEdit && !isAddingProject">ID: {{ partner.orderNumber }}</span>
              </div>
              
              <div class="project-info-grid">
                <div class="input-group">
                  <label>Titre du projet</label>
                  <input type="text" [(ngModel)]="initialProject.title" name="projectTitle" required placeholder="Ex: Refonte Site Vitrine">
                </div>
                <div class="input-group">
                  <label>Statut Initial</label>
                  <select [(ngModel)]="initialProject.status" name="projectStatus" class="form-select">
                    <option value="Conception">Conception</option>
                    <option value="Développement">Développement</option>
                    <option value="Tests">Tests</option>
                    <option value="Déploiement">Déploiement</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>
              </div>

              <div class="evolution-visual-editor">
                <div class="evolution-stage">
                  <div class="stage-header">
                    <span>Conception</span>
                    <span class="percentage">{{ initialProject.stages!.conception }}%</span>
                  </div>
                  <input type="range" [(ngModel)]="initialProject.stages!.conception" name="conception" min="0" max="100" class="range-slider">
                  <div class="stage-bar">
                    <div class="bar-fill conception" [style.width.%]="initialProject.stages!.conception"></div>
                  </div>
                </div>

                <div class="evolution-stage">
                  <div class="stage-header">
                    <span>Développement</span>
                    <span class="percentage">{{ initialProject.stages!.development }}%</span>
                  </div>
                  <input type="range" [(ngModel)]="initialProject.stages!.development" name="development" min="0" max="100" class="range-slider">
                  <div class="stage-bar">
                    <div class="bar-fill development" [style.width.%]="initialProject.stages!.development"></div>
                  </div>
                </div>

                <div class="evolution-stage">
                  <div class="stage-header">
                    <span>Tests & QA</span>
                    <span class="percentage">{{ initialProject.stages!.testing }}%</span>
                  </div>
                  <input type="range" [(ngModel)]="initialProject.stages!.testing" name="testing" min="0" max="100" class="range-slider">
                  <div class="stage-bar">
                    <div class="bar-fill testing" [style.width.%]="initialProject.stages!.testing"></div>
                  </div>
                </div>

                <div class="evolution-stage">
                  <div class="stage-header">
                    <span>Déploiement</span>
                    <span class="percentage">{{ initialProject.stages!.deployment }}%</span>
                  </div>
                  <input type="range" [(ngModel)]="initialProject.stages!.deployment" name="deployment" min="0" max="100" class="range-slider">
                  <div class="stage-bar">
                    <div class="bar-fill deployment" [style.width.%]="initialProject.stages!.deployment"></div>
                  </div>
                </div>
              </div>

              <div class="global-progress-preview">
                <label>Aperçu du Progrès Global</label>
                <div class="preview-card">
                  <div class="preview-info">
                    <span class="status">
                      {{ calculateTotalProgress() === 100 ? 'Projet Terminé' : 'Projet en cours' }}
                    </span>
                    <span class="total">{{ calculateTotalProgress() }}%</span>
                  </div>
                  <div class="preview-bar-bg">
                    <div class="preview-bar-fill" [style.width.%]="calculateTotalProgress()"></div>
                  </div>
                </div>
              </div>
            </section>
          }
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/ods-management-portal-x9/partners" class="btn-secondary">Annuler</button>
          <button type="submit" class="btn-primary" [disabled]="isSaving">
            @if (isSaving) {
              <span class="loader"></span>
            } @else {
              {{ isEdit ? 'Sauvegarder les modifications' : 'Créer le partenaire' }}
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    @use '../../../variables' as *;

    .editor-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      transition: max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.sidebar-collapsed {
        max-width: 1600px;
      }

      @media (max-width: 640px) { padding: 1rem 0.75rem; }
    }

    .editor-header {
      margin-bottom: 2.5rem;
      @media (max-width: 640px) { margin-bottom: 1.5rem; }
      .header-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        @media (max-width: 640px) { gap: 1rem; }
      }
      .btn-back {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
        svg { width: 1.25rem; height: 1.25rem; }
        &:hover { color: var(--accent-color); }
      }
      .page-title { 
        font-size: 1.75rem; 
        color: var(--text-color); 
        margin: 0;
        @media (max-width: 640px) { font-size: 1.25rem; }
      }
    }

    .editor-form {
      background: white;
      padding: 2.5rem;
      border-radius: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.05);
      @media (max-width: 640px) { padding: 1.5rem 1rem; border-radius: 1rem; }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem;
      @media (max-width: 768px) { 
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      &.single-column {
        grid-template-columns: 1fr;
        max-width: 900px;
        margin: 0 auto;
        transition: max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

        .sidebar-collapsed & {
          max-width: 1100px;
        }

        @media (max-width: 640px) { max-width: 100%; }
      }
    }

    .form-section {
      &.full-width { grid-column: span 2; @media (max-width: 768px) { grid-column: span 1; } }
      .section-title { font-size: 1.125rem; color: var(--text-muted); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
    }

    .project-info-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
      @media (max-width: 640px) { grid-template-columns: 1fr; gap: 1rem; }
    }

    .evolution-visual-editor {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      background: rgba(0, 0, 0, 0.02);
      padding: 2rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
      @media (max-width: 768px) { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.25rem; }

      .evolution-stage {
        .stage-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          .percentage { color: var(--accent-color); font-weight: 600; }
        }

        .range-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--dark-secondary);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        }

        .stage-bar {
          height: 4px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 2px;
          overflow: hidden;
          .bar-fill {
            height: 100%;
            transition: width 0.3s ease;
            &.conception { background: #3b82f6; }
            &.development { background: #8b5cf6; }
            &.testing { background: #ec4899; }
            &.deployment { background: #10b981; }
          }
        }
      }
    }

    .global-progress-preview {
      label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-muted); margin-bottom: 1rem; }
      .preview-card {
        background: var(--dark-secondary);
        padding: 1.5rem;
        border-radius: 1rem;
        color: white;
        @media (max-width: 640px) { padding: 1.25rem; }
        
        .preview-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          .status { font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
          .total { font-size: 1.25rem; font-weight: 700; }
        }

        .preview-bar-bg {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          .preview-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #34d399);
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      }
    }

    .input-group {
      margin-bottom: 1.5rem;
      label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-color); margin-bottom: 0.5rem; }
      input, select {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: rgba(0, 0, 0, 0.02);
        color: var(--text-color);
        &:focus { outline: none; border-color: var(--accent-color); background: white; }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1.25rem;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      @media (max-width: 640px) { margin-top: 2rem; flex-direction: column-reverse; }

      button {
        padding: 0.875rem 2rem;
        border-radius: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 0.9375rem;

        &.btn-secondary { 
          background: #f1f5f9; 
          border: 1px solid rgba(0, 0, 0, 0.05);
          color: $light-text;
          &:hover { background: #e2e8f0; transform: translateY(-2px); }
        }

        &.btn-primary { 
          background: linear-gradient(135deg, $light-secondary, #00C2CC); 
          border: none; 
          color: white; 
          box-shadow: 0 8px 20px -5px rgba($light-secondary, 0.4);
          &:hover { 
            transform: translateY(-3px); 
            box-shadow: 0 12px 25px -5px rgba($light-secondary, 0.5);
            filter: brightness(1.05);
          }
          &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
        }
        @media (max-width: 640px) { width: 100%; }
      }
    }

    .alert-info {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        font-size: 0.8125rem;
        font-weight: 500;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .badge {
        background: var(--dark-secondary);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 2rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
    }

    .helper-text {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 0.5rem;
        font-style: italic;
    }

    .section-header-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        .section-title { margin-bottom: 0 !important; }
    }

    input:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background: rgba(0, 0, 0, 0.05) !important;
        border-color: rgba(0, 0, 0, 0.05) !important;
    }

    .form-select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1rem;
        padding-right: 2.5rem !important;
    }

    :host-context(.dark) {
      .editor-form { background: #1e293b; border-color: rgba(255, 255, 255, 0.05); }
      .evolution-visual-editor { background: #0f172a; }
      .range-slider { background: rgba(255, 255, 255, 0.1) !important; }
      .input-group input, .input-group select { background: #0f172a; border-color: rgba(255, 255, 255, 0.1); color: white; }
      input:disabled { background: rgba(255, 255, 255, 0.05) !important; color: $dark-text-soft; }
      .page-title { color: white; }
      .alert-info { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); }
      .helper-text { color: $dark-text-soft; }
      
      .form-actions button {
        &.btn-secondary {
          background: #334155;
          color: white;
          border-color: rgba(255, 255, 255, 0.1);
          &:hover { background: #475569; }
        }
        &.btn-primary {
          background: linear-gradient(135deg, $dark-secondary, #7DD3FC);
          color: $dark-bg;
          box-shadow: 0 0 20px rgba($dark-secondary, 0.3);
          &:hover { box-shadow: 0 0 30px rgba($dark-secondary, 0.5); }
        }
      }
    }
  `]
})
export class PartnerEditorComponent implements OnInit {
  private partnerService = inject(PartnerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  sidebarService = inject(SidebarService);

  partner: Partial<Partner> = {
    name: '',
    email: '',
    orderNumber: '',
    projects: []
  };

  initialProject: Partial<Project> = {
    title: '',
    status: 'Conception',
    progress: 0,
    stages: { conception: 0, development: 0, testing: 0, deployment: 0 },
    history: []
  };

  isEdit = false;
  isAddingProject = false;
  editProjectIndex: number | null = null;
  isSaving = false;

  get isIdentityOnly(): boolean {
    return this.isEdit && !this.isAddingProject && this.editProjectIndex === null;
  }

  get isProjectOnly(): boolean {
    return this.isEdit && (this.isAddingProject || this.editProjectIndex !== null);
  }

  get showIdentitySection(): boolean {
    return !this.isProjectOnly;
  }

  get showProjectSection(): boolean {
    return !this.isIdentityOnly;
  }

  calculateTotalProgress(): number {
    if (!this.initialProject.stages) return 0;
    const { conception, development, testing, deployment } = this.initialProject.stages;
    const total = (conception + development + testing + deployment) / 4;
    return Math.round(total);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.isAddingProject = this.route.snapshot.queryParamMap.has('addProject');
      const indexParam = this.route.snapshot.queryParamMap.get('editProjectIndex');
      this.editProjectIndex = indexParam !== null ? parseInt(indexParam, 10) : null;

      this.partnerService.getPartner(id).subscribe(data => {
        this.partner = data;

        if (this.isAddingProject) {
          // Add a NEW project
          this.initialProject = {
            title: '',
            status: 'Conception',
            progress: 0,
            stages: { conception: 0, development: 0, testing: 0, deployment: 0 },
            history: []
          };
        } else if (this.editProjectIndex !== null && this.partner.projects && this.partner.projects[this.editProjectIndex]) {
          // Edit SPECIFIC project
          const project = this.partner.projects[this.editProjectIndex];
          this.initialProject = {
            ...project,
            stages: project.stages ? { ...project.stages } : { conception: project.progress || 0, development: 0, testing: 0, deployment: 0 }
          };
        } else if (this.partner.projects && this.partner.projects.length > 0) {
          // Default to last project if no index provided
          const lastProject = this.partner.projects[this.partner.projects.length - 1];
          this.initialProject = {
            ...lastProject,
            stages: lastProject.stages ? { ...lastProject.stages } : { conception: lastProject.progress || 0, development: 0, testing: 0, deployment: 0 }
          };
        }
      });
    }
  }

  save() {
    if (this.isSaving) return;

    // Validate required fields
    if (!this.partner.name || !this.partner.email || !this.partner.orderNumber) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.isSaving = true;

    if (this.isEdit) {
      // Sync project changes
      if (this.initialProject.title) {
        this.initialProject.progress = this.calculateTotalProgress();

        if (this.isAddingProject) {
          if (!this.partner.projects) this.partner.projects = [];
          this.partner.projects.push(this.initialProject as Project);
        } else if (this.editProjectIndex !== null && this.partner.projects) {
          // Update specific project
          this.partner.projects[this.editProjectIndex] = this.initialProject as Project;
        } else if (this.partner.projects && this.partner.projects.length > 0) {
          // Fallback to last project
          this.partner.projects[this.partner.projects.length - 1] = this.initialProject as Project;
        } else {
          this.partner.projects = [this.initialProject as Project];
        }
      }

      this.partnerService.updatePartner(this.partner.id!, this.partner).subscribe({
        next: () => {
          this.router.navigate(['/ods-management-portal-x9/partners']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Update failed:', err);
          alert('Erreur lors de la mise à jour: ' + (err.error?.message || err.message));
        }
      });
    } else {
      // Add the initial project
      if (this.initialProject.title) {
        this.initialProject.progress = this.calculateTotalProgress();
        this.partner.projects = [this.initialProject as Project];
      }

      this.partnerService.createPartner(this.partner).subscribe({
        next: () => {
          this.router.navigate(['/ods-management-portal-x9/partners']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Creation failed:', err);
          alert('Erreur lors de la création: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
