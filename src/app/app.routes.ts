import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { EditCardComponent } from './features/digital-card/presentation/edit-card/edit-card.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
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
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/presentation/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'my-cards',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/digital-card/presentation/my-cards/my-cards.component').then(m => m.MyCardsComponent)
  },
  {
    path: 'create-card',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/digital-card/presentation/create-card/create-card.component').then(m => m.CreateCardComponent)
  },
  { path: 'edit-card', component: EditCardComponent },
];
