import { Routes } from '@angular/router';
import { authGuardGuard } from './guards/auth-guard-guard';
import { dashboardGuard } from './guards/dashboard-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then(m => m.Products)
    },
    {
        path: 'carts',
        loadComponent: () => import('./pages/carts/carts').then(m => m.Carts)
    },
    {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders').then(m => m.Orders)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login),
        canActivate: [authGuardGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [dashboardGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
        canActivate: [adminGuard]
    }
];
