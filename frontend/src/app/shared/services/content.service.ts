import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config';

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    private http = inject(HttpClient);
    private apiUrl = `${API_URL}/content`;

    getContent(type: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${type}`);
    }

    updateContent(type: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${type}`, data);
    }
}
