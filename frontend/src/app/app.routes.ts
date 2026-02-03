import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public/layout/public-layout.component';
import { ADMIN_PATH } from './admin/admin.config';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./public/pages/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'services',
                loadComponent: () => import('./public/pages/services.component').then(m => m.ServicesComponent)
            },
            {
                path: 'about',
                loadComponent: () => import('./public/pages/about.component').then(m => m.AboutComponent)
            },
            {
                path: 'contact',
                loadComponent: () => import('./public/pages/contact.component').then(m => m.ContactComponent)
            },
            {
                path: 'faq',
                loadComponent: () => import('./public/pages/faq.component').then(m => m.FaqComponent)
            },
            {
                path: 'suivi',
                loadComponent: () => import('./public/pages/engagement.component').then(m => m.EngagementComponent)
            },
            {
                path: 'privacy',
                loadComponent: () => import('./public/pages/privacy.component').then(m => m.PrivacyComponent)
            },
            {
                path: 'terms',
                loadComponent: () => import('./public/pages/terms.component').then(m => m.TermsComponent)
            },
            {
                path: 'notre-equipe',
                loadComponent: () => import('./public/pages/team.component').then(m => m.TeamComponent)
            }
        ]
    },
    {
        path: ADMIN_PATH,
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'admin',
        redirectTo: ''
    },
    {
        path: '**',
        redirectTo: ''
    }
];
