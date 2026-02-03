import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TeamService, TeamMember } from '../../shared/services/team.service';

@Component({
  selector: 'app-team-member-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="editor-container">
      <header class="editor-header">
        <div class="header-info">
          <h1>{{ isEditing() ? "Modifier le Membre" : "Nouveau Membre" }}</h1>
          <p>{{ isEditing() ? "Mettez à jour les informations du membre de l'équipe." : "Ajoutez un nouveau talent à votre équipe." }}</p>
        </div>
        <button routerLink="/ods-management-portal-x9/team" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour à la liste
        </button>
      </header>

      <div class="editor-card animate-in">
        <form (submit)="saveMember($event)" class="editor-form">
          <div class="form-body">
            <div class="form-main">
              <div class="grid-2-cols">
                <div class="form-group">
                  <label>Nom Complet</label>
                  <input type="text" [(ngModel)]="member.name" name="name" required placeholder="Ex: Jean Dupont">
                </div>
                <div class="form-group">
                  <label>Rôle / Fonction</label>
                  <input type="text" [(ngModel)]="member.role" name="role" required placeholder="Ex: Lead Developer">
                </div>
              </div>

              <div class="form-group">
                <label>Bio / Description</label>
                <textarea [(ngModel)]="member.bio" name="bio" rows="4" required placeholder="Une courte présentation du membre..."></textarea>
              </div>

              <div class="social-section">
                <h3>Liens Sociaux</h3>
                <div class="grid-2-cols">
                  <div class="form-group">
                    <label>LinkedIn</label>
                    <input type="url" [(ngModel)]="member.socials.linkedin" name="linkedin" placeholder="https://linkedin.com/in/...">
                  </div>
                  <div class="form-group">
                    <label>GitHub</label>
                    <input type="url" [(ngModel)]="member.socials.github" name="github" placeholder="https://github.com/...">
                  </div>
                  <div class="form-group">
                    <label>Email Professionnel</label>
                    <input type="email" [(ngModel)]="member.socials.email" name="email" placeholder="contact@ods.com">
                  </div>
                  <div class="form-group">
                    <label>Twitter / X</label>
                    <input type="url" [(ngModel)]="member.socials.twitter" name="twitter" placeholder="https://x.com/...">
                  </div>
                </div>
              </div>
            </div>

            <div class="form-sidebar">
              <div class="form-group">
                <label>Photo de Profil</label>
                <div class="image-upload-zone" [class.has-image]="member.image" (click)="photoInput.click()">
                  @if (member.image) {
                    <div class="preview-container">
                      <img [src]="member.image" alt="Preview">
                      <div class="change-overlay">Changer la photo</div>
                    </div>
                  } @else {
                    <div class="upload-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                      <span>Télécharger une photo</span>
                    </div>
                  }
                  <input #photoInput type="file" (change)="onFileSelected($event)" style="display: none" accept="image/*">
                </div>
              </div>

              <div class="form-group checkbox-group">
                <label class="switch-container">
                  <input type="checkbox" [(ngModel)]="member.isPublished" name="isPublished">
                  <span class="slider"></span>
                  <span class="label-text">Publier sur le site</span>
                </label>
                <p class="help-text">Si désactivé, le membre restera en brouillon.</p>
              </div>

              <div class="form-group">
                <label>Ordre d'affichage</label>
                <input type="number" [(ngModel)]="member.order" name="order" min="0">
              </div>
            </div>
          </div>

          <div class="form-footer">
            <button type="button" routerLink="/ods-management-portal-x9/team" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-submit" [disabled]="isSaving()">
              {{ isSaving() ? 'Enregistrement...' : (isEditing() ? 'Mettre à jour' : 'Ajouter le membre') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./team-member-editor.component.scss']
})
export class TeamMemberEditorComponent implements OnInit {
  private teamService = inject(TeamService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditing = signal(false);
  isSaving = signal(false);

  member: TeamMember = {
    name: '',
    role: '',
    bio: '',
    image: '',
    socials: {},
    isPublished: false,
    order: 0
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.loadMember(id);
    }
  }

  loadMember(id: string) {
    this.teamService.getMember(id).subscribe(data => {
      if (data) {
        this.member = { ...data };
        if (!this.member.socials) this.member.socials = {};
      } else {
        alert('Membre introuvable');
        this.router.navigate(['/ods-management-portal-x9/team']);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isSaving.set(true);
      this.teamService.uploadImage(file).subscribe({
        next: (res) => {
          this.member.image = res.url;
          this.isSaving.set(false);
        },
        error: () => {
          alert("Erreur lors de l'upload");
          this.isSaving.set(false);
        }
      });
    }
  }

  saveMember(event: Event) {
    event.preventDefault();
    if (!this.member.name || !this.member.role) {
      alert('Veuillez remplir les noms et rôles');
      return;
    }

    this.isSaving.set(true);
    const obs = this.isEditing()
      ? this.teamService.updateMember(this.member.id!, this.member)
      : this.teamService.createMember(this.member);

    obs.subscribe({
      next: () => {
        this.router.navigate(['/ods-management-portal-x9/team']);
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de l'enregistrement");
        this.isSaving.set(false);
      }
    });
  }
}
