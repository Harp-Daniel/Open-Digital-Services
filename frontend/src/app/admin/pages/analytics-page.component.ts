import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService, StatsSummary, DailyStats, WeekdayStats, MonthlyStats } from '../../shared/services/analytics.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-analytics-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './analytics-page.component.html',
    styleUrl: './analytics-page.component.scss'
})
export class AnalyticsPageComponent implements OnInit, AfterViewInit {
    private analyticsService = inject(AnalyticsService);

    @ViewChild('dailyChart') dailyChartCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('weekdayChart') weekdayChartCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('monthlyChart') monthlyChartCanvas!: ElementRef<HTMLCanvasElement>;

    private dailyChart?: Chart;
    private weekdayChart?: Chart;
    private monthlyChart?: Chart;

    // Data signals
    realTimeCount = signal<number>(0);
    summary = signal<StatsSummary | null>(null);
    activeData = signal<any[]>([]);
    selectedDataPoint = signal<{ label: string, value: number } | null>(null);

    // UI state
    loading = signal(true);
    selectedPeriod = signal<string>('30days');
    activeView = signal<'daily' | 'weekday' | 'monthly'>('daily');
    error = signal<string | null>(null);

    // Period options
    periodOptions = [
        { value: 'today', label: "Aujourd'hui" },
        { value: '7days', label: '7 derniers jours' },
        { value: '30days', label: '30 derniers jours' },
        { value: '3months', label: '3 derniers mois' },
        { value: '12months', label: '12 derniers mois' }
    ];

    ngOnInit() {
        this.initRealTimeStats();
        this.loadStats();
    }

    initRealTimeStats() {
        this.analyticsService.getVisitorCount().subscribe(count => {
            this.realTimeCount.set(count);
        });
    }

    ngAfterViewInit() {
        // Charts will be initialized once data is loaded
    }

    loadStats() {
        this.loading.set(true);
        this.error.set(null);

        const { startDate, endDate } = this.getDateRange(this.selectedPeriod());

        // Load summary
        this.analyticsService.getStatsSummary(startDate, endDate).subscribe({
            next: (data) => {
                this.summary.set(data);
                this.updateView();
            },
            error: (err) => {
                console.error('Error loading summary:', err);
                this.error.set('Erreur lors du chargement des statistiques');
                this.loading.set(false);
            }
        });
    }

    updateView(view: 'daily' | 'weekday' | 'monthly' = this.activeView()) {
        this.activeView.set(view);
        const { startDate, endDate } = this.getDateRange(this.selectedPeriod());

        if (view === 'daily') {
            this.analyticsService.getDailyStats(startDate, endDate).subscribe({
                next: (res) => {
                    this.activeData.set(res.data);
                    this.renderChart();
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        } else if (view === 'weekday') {
            this.analyticsService.getWeekdayStats(startDate, endDate).subscribe({
                next: (res) => {
                    this.activeData.set(res.data);
                    this.renderChart();
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        } else if (view === 'monthly') {
            this.analyticsService.getMonthlyStats(new Date().getFullYear()).subscribe({
                next: (res) => {
                    this.activeData.set(res.data);
                    this.renderChart();
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }

    renderChart() {
        if (!this.dailyChartCanvas) return;
        const ctx = this.dailyChartCanvas.nativeElement.getContext('2d');
        if (!ctx) return;

        if (this.dailyChart) this.dailyChart.destroy();

        const data = this.activeData();
        const view = this.activeView();

        let labels: string[] = [];
        let values: number[] = [];
        let label = 'Visites';
        let type: any = 'line';

        if (view === 'daily') {
            labels = data.map(d => d.date);
            values = data.map(d => d.count);
        } else if (view === 'weekday') {
            labels = data.map(d => d.weekday);
            values = data.map(d => d.count);
            type = 'bar';
        } else if (view === 'monthly') {
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            labels = data.map(d => {
                const parts = d.month.split('-');
                return monthNames[parseInt(parts[1]) - 1] || d.month;
            });
            values = data.map(d => d.count);
            type = 'line';
        }

        this.dailyChart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: values,
                    borderColor: '#3b82f6',
                    backgroundColor: type === 'line' ? 'rgba(59, 130, 246, 0.1)' : '#3b82f6',
                    fill: type === 'line',
                    tension: 0.4,
                    borderRadius: type === 'bar' ? 6 : 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: false // Disable default tooltip to use our signal-driven one
                    }
                },
                onHover: (event: any, elements: any[]) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        this.selectedDataPoint.set({
                            label: labels[index],
                            value: values[index]
                        });
                    } else {
                        this.selectedDataPoint.set(null);
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    onViewChange(view: 'daily' | 'weekday' | 'monthly') {
        this.updateView(view);
    }

    onPeriodChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.selectedPeriod.set(select.value);
        this.loadStats();
    }

    getDateRange(period: string): { startDate: Date; endDate: Date } {
        const endDate = new Date();
        const startDate = new Date();

        switch (period) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '3months':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case '12months':
                startDate.setMonth(startDate.getMonth() - 12);
                break;
        }

        return { startDate, endDate };
    }

    formatNumber(num: number | undefined): string {
        if (num === undefined) return '0';
        return num.toLocaleString('fr-FR');
    }

    formatGrowth(growth: number | null | undefined): string {
        if (growth === null || growth === undefined) return '0%';
        const sign = growth > 0 ? '+' : '';
        return `${sign}${growth.toFixed(1)}%`;
    }
}
