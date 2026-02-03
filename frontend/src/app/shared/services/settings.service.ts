import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

export interface SiteSettings {
    showTeamPage: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private firestore = inject(Firestore);
    private settingsDocPath = 'settings/site_config';

    private settingsCache$: Observable<SiteSettings> | null = null;

    getSettings(): Observable<SiteSettings> {
        if (!this.settingsCache$) {
            const settingsDoc = doc(this.firestore, this.settingsDocPath);
            this.settingsCache$ = (docData(settingsDoc) as Observable<SiteSettings>).pipe(
                shareReplay(1)
            );
        }
        return this.settingsCache$;
    }

    updateSettings(settings: SiteSettings): Promise<void> {
        const settingsDoc = doc(this.firestore, this.settingsDocPath);
        return setDoc(settingsDoc, settings, { merge: true });
    }
}
