import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'products',
        loadChildren: () => import('./pages/products/products').then(m => m.Products)
    },
    {
        path: 'carts',
        loadChildren: () => import('./pages/carts/carts').then(m => m.Carts)
    },
    {
        path: 'orders',
        loadChildren: () => import('./pages/orders/orders').then(m => m.Orders)
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
    }
];
