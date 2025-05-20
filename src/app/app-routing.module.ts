import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyCardsComponent } from './features/digital-card/presentation/my-cards/my-cards.component';
import { CreateCardComponent } from './features/digital-card/presentation/create-card/create-card.component';
import { CardListComponent } from './features/digital-card/presentation/card-list/card-list.component';
import { LoginComponent } from './features/auth/presentation/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/cards', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cards', component: CardListComponent },
  { path: 'create-card', component: CreateCardComponent, canActivate: [AuthGuard] },
  { path: 'my-cards', component: MyCardsComponent, canActivate: [AuthGuard] },
  { path: 'cards/:username', component: MyCardsComponent },
  { path: '**', redirectTo: '/cards' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 