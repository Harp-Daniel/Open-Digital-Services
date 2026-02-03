import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectTrackingService, ProjectStatus, PartnerTrackingInfo } from '../../shared/services/project-tracking.service';

@Component({
    selector: 'app-engagement',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './engagement.component.html',
    styleUrl: './engagement.component.scss'
})
export class EngagementComponent implements OnInit {
    private trackingService = inject(ProjectTrackingService);
    private cdr = inject(ChangeDetectorRef);

    searchQuery = '';
    isSearching = false;
    partnerInfo = signal<PartnerTrackingInfo | null>(null);
    hasSearched = false;

    subscriberEmail = '';
    subscriberHoneypot = '';
    isSubmitting = false;
    isSubscribed = false;

    ngOnInit() {
        window.scrollTo(0, 0);
    }

    onSearch() {
        if (!this.searchQuery.trim()) return;

        this.isSearching = true;
        this.hasSearched = false;
        this.trackingService.trackProject(this.searchQuery).subscribe(result => {
            console.log('Search Result:', result);
            this.partnerInfo.set(result);
            this.isSearching = false;
            this.hasSearched = true;

            // Force change detection to show results immediately
            this.cdr.detectChanges();

            // Auto-scroll to results for better UX
            if (result) {
                setTimeout(() => {
                    const element = document.querySelector('.search-results-container');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        });
    }

    onSubscribe() {
        if (!this.subscriberEmail.trim()) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.subscriberEmail)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        this.isSubmitting = true;
        this.trackingService.subscribeToNewsletter({
            email: this.subscriberEmail,
            honeypot: this.subscriberHoneypot
        }).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.isSubscribed = true;
                this.subscriberEmail = '';
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error('Subscription error:', err);

                // More specific error messages
                if (err.status === 409) {
                    alert('Cet email est déjà inscrit à notre newsletter.');
                } else if (err.status === 0) {
                    alert('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
                } else {
                    alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
                }
            }
        });
    }
}
