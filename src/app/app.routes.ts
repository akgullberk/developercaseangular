import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/digital-card/presentation/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/presentation/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/presentation/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/presentation/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'my-cards',
    canActivate: [authGuard],
    loadComponent: () => import('./features/digital-card/presentation/my-cards/my-cards.component').then(m => m.MyCardsComponent)
  },
  {
    path: 'create-card',
    canActivate: [authGuard],
    loadComponent: () => import('./features/digital-card/presentation/create-card/create-card.component').then(m => m.CreateCardComponent)
  }
];
