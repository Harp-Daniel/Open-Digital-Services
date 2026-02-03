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
    serverTimestamp,
    setDoc
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { cloudinaryConfig } from '../../cloudinary.config';

export interface ServiceItem {
    id?: string;
    title: string;
    description: string;
    category: string;
    image: string;
    icon: string;
    tags: string[];
    createdAt?: any;
}

export interface CategoryBanner {
    id?: string;
    categoryName: string;
    images: string[];
    updatedAt?: any;
}

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    private firestore = inject(Firestore);
    private http = inject(HttpClient);

    private getServicesCollection() {
        return collection(this.firestore, 'services');
    }

    private readonly CACHE_KEY = 'ods_services_cache';

    getServices(): Observable<ServiceItem[]> {
        const q = query(this.getServicesCollection(), orderBy('title', 'asc'));
        return (collectionData(q, { idField: 'id' }) as Observable<ServiceItem[]>).pipe(
            map(services => {
                this.saveServicesToCache(services);
                return services;
            })
        );
    }

    getCachedServices(): ServiceItem[] | null {
        const cached = localStorage.getItem(this.CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    }

    private saveServicesToCache(services: ServiceItem[]) {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(services));
    }

    getOptimizedImageUrl(url: string, width: number = 800): string {
        if (!url || !url.includes('cloudinary.com')) return url;

        // Check if it already has transformations
        if (url.includes('/upload/v')) {
            const parts = url.split('/upload/');
            return `${parts[0]}/upload/f_auto,q_auto,w_${width}/${parts[1]}`;
        }
        return url;
    }

    getService(id: string): Observable<ServiceItem> {
        const serviceDoc = doc(this.firestore, `services/${id}`);
        return docData(serviceDoc, { idField: 'id' }) as Observable<ServiceItem>;
    }

    createService(service: ServiceItem): Observable<any> {
        return from(addDoc(this.getServicesCollection(), {
            ...service,
            createdAt: serverTimestamp()
        }));
    }

    updateService(id: string, service: Partial<ServiceItem>): Observable<any> {
        const serviceDoc = doc(this.firestore, `services/${id}`);
        return from(updateDoc(serviceDoc, service));
    }

    deleteService(id: string): Observable<any> {
        const serviceDoc = doc(this.firestore, `services/${id}`);
        return from(deleteDoc(serviceDoc));
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

    // Category Banners Methods
    getCategoryBanner(categoryName: string): Observable<CategoryBanner> {
        const path = `categoryBanners/${categoryName.replace(/\//g, '_')}`;
        const bannerDoc = doc(this.firestore, path);
        return docData(bannerDoc, { idField: 'id' }) as Observable<CategoryBanner>;
    }

    saveCategoryBanner(categoryName: string, images: string[]): Observable<any> {
        const path = `categoryBanners/${categoryName.replace(/\//g, '_')}`;
        const bannerDoc = doc(this.firestore, path);
        return from(setDoc(bannerDoc, {
            categoryName,
            images,
            updatedAt: serverTimestamp()
        }, { merge: true }));
    }
}
