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
    showSubscribeModal = signal(false);
    modalData = signal<{ title: string; message: string; type: 'success' | 'error' } | null>(null);

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
            this.modalData.set({
                title: 'Erreur',
                message: 'Veuillez entrer une adresse email valide.',
                type: 'error'
            });
            this.showSubscribeModal.set(true);
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
                this.modalData.set({
                    title: 'Félicitations !',
                    message: 'Bienvenue au Open Digital Club. Votre inscription a été validée avec succès.',
                    type: 'success'
                });
                this.showSubscribeModal.set(true);
                this.subscriberEmail = '';
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error('Subscription error:', err);

                let message = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
                let title = 'Erreur';

                if (err.status === 409) {
                    message = 'Cet email est déjà inscrit à notre newsletter.';
                    title = 'Déjà inscrit';
                } else if (err.status === 0) {
                    message = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
                }

                this.modalData.set({
                    title: title,
                    message: message,
                    type: 'error'
                });
                this.showSubscribeModal.set(true);
            }
        });
    }

    closeModal() {
        this.showSubscribeModal.set(false);
        this.modalData.set(null);
    }
}
