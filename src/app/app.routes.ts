import { Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './pages/auth/guards';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadComponent: () => import('./pages/auth/auth.component')
  },
  {
    path: 'admin',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () => import('./pages/home/home.component'),
    children: [
      {
        path: 'hamburguer',
        loadComponent: () => import('./pages/hamburguer/hamburguer.component'),
      },
      {
        path: 'drink',
        loadComponent: () => import('./pages/drink/drink.component'),
      },
      {
        path: 'snack',
        loadComponent: () => import('./pages/snack/snack.component'),
      },
      {
        path: 'dessert',
        loadComponent: () => import('./pages/dessert/dessert.component'),
      },
      {
        path: 'extra',
        loadComponent: () => import('./pages/extra/extra.component'),
      },
      {
        path: 'horario',
        loadComponent: () => import('./pages/schedule/schedule.component'),
      },
      {
        path: 'user',
        loadComponent: () => import('./pages/user/user.component'),
      },
      { path: '**', redirectTo: 'hamburguer' },
    ]
  },
  { path: '**', redirectTo: 'auth' },
];
