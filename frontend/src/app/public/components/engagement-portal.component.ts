import { Component, inject, EventEmitter, Output, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectTrackingService, ProjectStatus, PartnerTrackingInfo } from '../../shared/services/project-tracking.service';

@Component({
    selector: 'app-engagement-portal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './engagement-portal.component.html',
    styleUrl: './engagement-portal.component.scss'
})
export class EngagementPortalComponent {
    private trackingService = inject(ProjectTrackingService);
    private cdr = inject(ChangeDetectorRef);
    @Output() close = new EventEmitter<void>();

    activeTab: 'tracking' | 'club' = 'tracking';
    searchQuery = '';
    isSearching = false;
    partnerInfo = signal<PartnerTrackingInfo | null>(null);
    hasSearched = false;

    subscriberEmail = '';
    subscriberHoneypot = '';
    isSubmitting = false;
    isSubscribed = false;

    setTab(tab: 'tracking' | 'club') {
        this.activeTab = tab;
    }

    onSearch() {
        if (!this.searchQuery.trim()) return;

        this.isSearching = true;
        this.hasSearched = false;
        this.trackingService.trackProject(this.searchQuery).subscribe(result => {
            this.partnerInfo.set(result);
            this.isSearching = false;
            this.hasSearched = true;
            this.cdr.detectChanges();
        });
    }

    onSubscribe() {
        if (!this.subscriberEmail.trim()) return;

        this.isSubmitting = true;
        this.trackingService.subscribeToNewsletter({
            email: this.subscriberEmail,
            honeypot: this.subscriberHoneypot
        }).subscribe(() => {
            this.isSubmitting = false;
            this.isSubscribed = true;
            this.subscriberEmail = '';
        });
    }

    onClose() {
        this.close.emit();
    }
}
