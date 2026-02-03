import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService, TeamMember } from '../../shared/services/team.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-public-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="team-container">
      <section class="team-header animate-in">
        <div class="header-content">
          <h1>Notre <span>Équipe</span></h1>
          <p>Découvrez les visages passionnés et les experts qui propulsent votre transformation digitale au quotidien.</p>
        </div>
      </section>

      <section class="team-section animate-in">
        <div class="container">
          @if (isLoading()) {
            <div class="skeleton-container">
              <div class="team-grid">
                @for (i of [1,2,3,4]; track i) {
                  <div class="skeleton-card">
                    <div class="skeleton-img"></div>
                    <div class="skeleton-info">
                      <div class="skeleton-text-lg"></div>
                      <div class="skeleton-text-md"></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          } @else if (members().length > 0) {
            <div class="team-grid">
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
                          <img [src]="member.image || 'images/default-avatar.jpg'" [alt]="member.name" loading="lazy">
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
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state animate-in">
              <div class="empty-icon">👥</div>
              <p>Notre équipe est en pleine expansion. Revenez bientôt pour découvrir nos nouveaux talents.</p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  private teamService = inject(TeamService);

  members = signal<TeamMember[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.isLoading.set(true);
    this.teamService.getTeamMembers().pipe(
      map(allMembers => allMembers.filter(m => m.isPublished))
    ).subscribe({
      next: (publishedMembers) => {
        this.members.set(publishedMembers);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
}
