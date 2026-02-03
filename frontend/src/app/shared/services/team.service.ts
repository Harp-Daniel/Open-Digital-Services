import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    Firestore,
    collection,
    collectionData,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    docData,
    query,
    orderBy,
    serverTimestamp
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { cloudinaryConfig } from '../../cloudinary.config';

export interface TeamMember {
    id?: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    socials: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        email?: string;
    };
    isPublished: boolean;
    order: number;
    createdAt?: any;
}

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private firestore = inject(Firestore);
    private http = inject(HttpClient);

    private getTeamCollection() {
        return collection(this.firestore, 'team');
    }

    getTeamMembers(): Observable<TeamMember[]> {
        const q = query(this.getTeamCollection(), orderBy('order', 'asc'));
        return collectionData(q, { idField: 'id' }) as Observable<TeamMember[]>;
    }

    getMember(id: string): Observable<TeamMember> {
        const memberDoc = doc(this.firestore, `team/${id}`);
        return docData(memberDoc, { idField: 'id' }) as Observable<TeamMember>;
    }

    createMember(member: TeamMember): Observable<any> {
        return from(addDoc(this.getTeamCollection(), {
            ...member,
            createdAt: serverTimestamp()
        }));
    }

    updateMember(id: string, member: Partial<TeamMember>): Observable<any> {
        const memberDoc = doc(this.firestore, `team/${id}`);
        return from(updateDoc(memberDoc, member));
    }

    deleteMember(id: string): Observable<any> {
        const memberDoc = doc(this.firestore, `team/${id}`);
        return from(deleteDoc(memberDoc));
    }

    uploadImage(file: File): Observable<{ url: string }> {
        const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);

        return this.http.post<any>(url, formData).pipe(
            map(res => ({ url: res.secure_url }))
        );
    }
}
