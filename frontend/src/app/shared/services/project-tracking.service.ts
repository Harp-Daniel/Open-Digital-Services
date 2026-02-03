import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../config';

export interface ProjectStatus {
    id: string; // Unique ID for the project within the context
    projectName: string;
    overallProgress: number;
    progress: {
        conception: number;
        development: number;
        testing: number;
        deployment: number;
    };
    lastUpdate: string;
    status: string;
}

export interface PartnerTrackingInfo {
    name: string;
    orderNumber: string;
    email: string;
    projects: ProjectStatus[];
}

export interface Subscriber {
    id: string;
    email: string;
    subscribedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProjectTrackingService {
    private http = inject(HttpClient);
    private apiUrl = API_URL;

    trackProject(identifier: string): Observable<PartnerTrackingInfo | null> {
        // Sanitize identifier for URL
        const encodedQuery = encodeURIComponent(identifier.trim());
        return this.http.get<any>(`${this.apiUrl}/partners/search?query=${encodedQuery}`).pipe(
            map(response => {
                if (!response || !response.projects) return null;

                const projects: ProjectStatus[] = response.projects.map((project: any, index: number) => ({
                    id: project.id || `P-${index}`,
                    projectName: project.projectName || project.title,
                    overallProgress: project.overallProgress || 0,
                    progress: {
                        conception: project.overallProgress || 0,
                        development: 0,
                        testing: 0,
                        deployment: 0
                    },
                    lastUpdate: project.lastUpdate || new Date().toISOString(),
                    status: project.status || 'En attente'
                }));

                return {
                    name: response.name,
                    orderNumber: identifier, // Use input as fallback
                    email: identifier,        // Use input as fallback
                    projects: projects
                };
            })
        );
    }

    // Subscriber Management
    getSubscribers(): Observable<Subscriber[]> {
        return this.http.get<Subscriber[]>(`${this.apiUrl}/subscribers`);
    }

    subscribeToNewsletter(data: { email: string, honeypot?: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/subscribers`, data);
    }

    deleteSubscriber(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/subscribers/${id}`);
    }
}
