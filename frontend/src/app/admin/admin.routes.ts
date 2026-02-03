import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { authGuard } from './guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'services',
                loadComponent: () => import('./pages/services-management.component').then(m => m.ServicesManagementComponent)
            },
            {
                path: 'services/new',
                loadComponent: () => import('./pages/service-editor.component').then(m => m.ServiceEditorComponent)
            },
            {
                path: 'services/edit/:id',
                loadComponent: () => import('./pages/service-editor.component').then(m => m.ServiceEditorComponent)
            },
            {
                path: 'contacts',
                loadComponent: () => import('./pages/contacts-management.component').then(m => m.ContactsManagementComponent)
            },
            {
                path: 'contacts/:id',
                loadComponent: () => import('./pages/contact-details.component').then(m => m.ContactDetailsComponent)
            },
            {
                path: 'partners',
                loadComponent: () => import('./pages/partners-management.component').then(m => m.PartnersManagementComponent)
            },
            {
                path: 'partners/new',
                loadComponent: () => import('./pages/partner-editor.component').then(m => m.PartnerEditorComponent)
            },
            {
                path: 'partners/edit/:id',
                loadComponent: () => import('./pages/partner-editor.component').then(m => m.PartnerEditorComponent)
            },
            {
                path: 'subscribers/:id',
                loadComponent: () => import('./pages/subscriber-details.component').then(m => m.SubscriberDetailsComponent)
            },
            {
                path: 'team',
                loadComponent: () => import('./pages/team-management.component').then(m => m.TeamManagementComponent)
            },
            {
                path: 'team/new',
                loadComponent: () => import('./pages/team-member-editor.component').then(m => m.TeamMemberEditorComponent)
            },
            {
                path: 'team/edit/:id',
                loadComponent: () => import('./pages/team-member-editor.component').then(m => m.TeamMemberEditorComponent)
            },
            {
                path: 'analytics',
                loadComponent: () => import('./pages/analytics-page.component').then(m => m.AnalyticsPageComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings.component').then(m => m.SettingsComponent)
            }
        ]
    }
];
