import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config';

export interface ContactMessage {
    id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'read' | 'unread';
    createdAt?: any;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private http = inject(HttpClient);
    private apiUrl = `${API_URL}/contacts`;

    getMessages(): Observable<ContactMessage[]> {
        return this.http.get<ContactMessage[]>(this.apiUrl);
    }

    createMessage(message: any): Observable<any> {
        return this.http.post(this.apiUrl, message);
    }

    markAsRead(id: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/read`, {});
    }

    deleteMessage(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
