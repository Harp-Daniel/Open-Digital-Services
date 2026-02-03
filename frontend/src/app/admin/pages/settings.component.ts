import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, SiteSettings } from '../../shared/services/settings.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <header class="dashboard-header">
        <h1 class="page-title">Paramètres du Site</h1>
        <p class="page-subtitle">Configurez les options d'affichage et les fonctionnalités globales.</p>
      </header>

      <div class="settings-grid animate-in">
        <!-- Navigation Settings -->
        <div class="settings-card">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            Navigation & Menus
          </h2>
          
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-label">Page Équipe</span>
              <span class="setting-description">Afficher le lien "Équipe" dans le menu de navigation public.</span>
            </div>
            <label class="switch">
              <input type="checkbox" [ngModel]="settings().showTeamPage" (ngModelChange)="toggleTeamPage($event)">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- Future Settings Placeholder -->
        <div class="settings-card" style="opacity: 0.6;">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Contact & Emails
          </h2>
          <p style="font-size: 0.85rem; color: #64748b; margin-top: 1rem;">D'autres options de configuration seront disponibles prochainement.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);

  settings = signal<SiteSettings>({ showTeamPage: false });

  ngOnInit() {
    this.settingsService.getSettings().subscribe(data => {
      if (data) {
        this.settings.set(data);
      }
    });
  }

  toggleTeamPage(value: boolean) {
    const newSettings = { ...this.settings(), showTeamPage: value };
    this.settingsService.updateSettings(newSettings).then(() => {
      this.settings.set(newSettings);
    }).catch(err => {
      console.error('Error updating settings:', err);
      // Revert if failed
      this.settings.set({ ...this.settings() });
    });
  }
}
