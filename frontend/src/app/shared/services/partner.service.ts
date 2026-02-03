import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config';

export interface ProjectHistory {
    status: string;
    date: string;
    comment: string;
}

export interface ProjectStages {
    conception: number;
    development: number;
    testing: number;
    deployment: number;
}

export interface Project {
    id?: string;
    title: string;
    status: 'Conception' | 'Développement' | 'Tests' | 'Déploiement' | 'Terminé';
    progress: number;
    stages?: ProjectStages;
    history: ProjectHistory[];
    createdAt?: string;
}

export interface Partner {
    id?: string;
    name: string;
    email: string;
    orderNumber: string;
    projects: Project[];
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class PartnerService {
    private http = inject(HttpClient);
    private apiUrl = `${API_URL}/partners`;

    getPartners(): Observable<Partner[]> {
        return this.http.get<Partner[]>(this.apiUrl);
    }

    getPartner(id: string): Observable<Partner> {
        return this.http.get<Partner>(`${this.apiUrl}/${id}`);
    }

    createPartner(partner: any): Observable<Partner> {
        return this.http.post<Partner>(this.apiUrl, partner);
    }

    updatePartner(id: string, partner: any): Observable<Partner> {
        return this.http.put<Partner>(`${this.apiUrl}/${id}`, partner);
    }

    deletePartner(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    addProject(partnerId: string, project: Partial<Project>): Observable<Project> {
        return this.http.post<Project>(`${this.apiUrl}/${partnerId}/projects`, project);
    }

    addProjectEvolution(partnerId: string, projectId: string, evolution: ProjectHistory): Observable<any> {
        return this.http.post(`${this.apiUrl}/${partnerId}/projects/${projectId}/evolution`, evolution);
    }
}
