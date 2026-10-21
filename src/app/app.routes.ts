import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: 'espacios',
        loadComponent: () => import('./pages/espacios/espacios.component').then((m) => m.EspaciosComponent)
      },
      {
        path: 'reservaciones',
        loadComponent: () => import('./pages/reservaciones/reservaciones.component').then((m) => m.ReservacionesComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  { path: '**', redirectTo: 'login' }
];