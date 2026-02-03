import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_URL } from '../../config';

export interface VisitorHit {
    id?: string;
    timestamp: any;
    userAgent: string;
    page: string;
}

export interface StatsSummary {
    totalVisits: number;
    averagePerDay: number;
    peakDay: { date: string; count: number } | null;
    growth: number;
    period: {
        startDate: string;
        endDate: string;
    };
}

export interface DailyStats {
    date: string;
    count: number;
}

export interface MonthlyStats {
    month: string;
    count: number;
}

export interface WeekdayStats {
    weekday: string;
    count: number;
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private firestore = inject(Firestore);
    private http = inject(HttpClient);
    private readonly apiUrl = `${API_URL}/analytics`;

    private readonly SESSION_KEY = 'ods_visit_tracked';

    /**
     * Record a visitor hit via the backend
     * Only records once per session to optimize costs and accuracy
     */
    recordHit(page: string = 'home'): void {
        // Check if already tracked in this session
        if (sessionStorage.getItem(this.SESSION_KEY)) {
            return;
        }

        this.http.post(`${this.apiUrl}/hit`, { page }).subscribe({
            next: () => {
                // Mark as tracked for this session
                sessionStorage.setItem(this.SESSION_KEY, 'true');
            }
        });
    }

    /**
     * Listen to real-time visitor count from Firestore
     */
    getVisitorCount(): Observable<number> {
        const summaryDoc = doc(this.firestore, 'analytics/summary');
        return docData(summaryDoc).pipe(
            map((data: any) => data?.totalVisits || 0),
            catchError(() => of(0))
        );
    }

    /**
     * Reset visitor counter (admin only)
     */
    resetVisitorCount(): Observable<any> {
        const url = `${this.apiUrl}/reset`;
        console.log('Calling reset endpoint:', url);
        return this.http.post(url, {});
    }

    /**
     * Get summary statistics for a period
     */
    getStatsSummary(startDate?: Date, endDate?: Date): Observable<StatsSummary> {
        let params: any = {};
        if (startDate) params.startDate = startDate.toISOString();
        if (endDate) params.endDate = endDate.toISOString();

        return this.http.get<StatsSummary>(`${this.apiUrl}/stats/summary`, { params });
    }

    /**
     * Get daily visitor statistics
     */
    getDailyStats(startDate?: Date, endDate?: Date): Observable<{ data: DailyStats[] }> {
        let params: any = {};
        if (startDate) params.startDate = startDate.toISOString();
        if (endDate) params.endDate = endDate.toISOString();

        return this.http.get<{ data: DailyStats[] }>(`${this.apiUrl}/stats/daily`, { params });
    }

    /**
     * Get monthly visitor statistics
     */
    getMonthlyStats(year?: number): Observable<{ data: MonthlyStats[] }> {
        let params: any = {};
        if (year) params.year = year;

        return this.http.get<{ data: MonthlyStats[] }>(`${this.apiUrl}/stats/monthly`, { params });
    }

    /**
     * Get visitor statistics by day of the week
     */
    getWeekdayStats(startDate?: Date, endDate?: Date): Observable<{ data: WeekdayStats[] }> {
        let params: any = {};
        if (startDate) params.startDate = startDate.toISOString();
        if (endDate) params.endDate = endDate.toISOString();

        return this.http.get<{ data: WeekdayStats[] }>(`${this.apiUrl}/stats/by-weekday`, { params });
    }
}
