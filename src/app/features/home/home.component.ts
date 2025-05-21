import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardListComponent } from '../digital-card/presentation/card-list/card-list.component';
import { AuthService } from '../auth/data/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardListComponent],
  template: `
    <main class="main-content">
      <section class="hero-section" *ngIf="!authService.isLoggedIn()">
        <div class="hero-content">
          <h1>Dijital Kartınızı <span class="highlight">Oluşturun</span></h1>
          <p>Profesyonel dijital kartvizitinizi oluşturun ve ağınızı genişletin</p>
          <button class="create-card-btn" routerLink="/register">
            <span>Hemen Başla</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="hero-background">
          <div class="gradient-circle circle-1"></div>
          <div class="gradient-circle circle-2"></div>
          <div class="gradient-circle circle-3"></div>
        </div>
      </section>

      <section class="hero-section" *ngIf="authService.isLoggedIn()">
        <div class="hero-content">
          <h1>Dijital Kartınızı <span class="highlight">Yönetin</span></h1>
          <p>Dijital kartınızı görüntüleyin, düzenleyin</p>
          <button class="create-card-btn" routerLink="/my-cards">
            <span>Dijital Kartım</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="hero-background">
          <div class="gradient-circle circle-1"></div>
          <div class="gradient-circle circle-2"></div>
          <div class="gradient-circle circle-3"></div>
        </div>
      </section>

      <section class="cards-section">
        <div class="section-header">
          <h2>Popüler Dijital Kartlar</h2>
          <p>Öne çıkan profesyonellerin kartları</p>
        </div>
        <div class="cards-grid">
          <app-card-list></app-card-list>
        </div>
      </section>
    </main>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
