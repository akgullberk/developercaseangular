import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/data/services/auth.service';
import { DigitalCardService, DigitalCardResponse } from '../digital-card/data/services/digital-card.service';
import { CardItemComponent } from '../digital-card/presentation/card-item/card-item.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardItemComponent],
  template: `
    <main class="main-content">
      <section class="hero-section" *ngIf="!authService.isLoggedIn()">
        <div class="hero-content">
          <h1>Dijital Kartınızı <span class="highlight">Oluşturun</span></h1>
          <p>Profesyonel dijital kartvizitinizi oluşturun ve ağınızı genişletin</p>
          <div class="button-group">
            <button class="create-card-btn" routerLink="/register">
              <span>Hemen Başla</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
              </svg>
            </button>
            <button class="show-all-cards-btn" routerLink="/all-cards">
              <span>Tüm Kartları Göster</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM13 14H15V11H18V9H15V6H13V9H10V11H13V14Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
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
          <div class="button-group">
            <button class="create-card-btn" routerLink="/my-cards">
              <span>Dijital Kartım</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
              </svg>
            </button>
            <button class="show-all-cards-btn" routerLink="/all-cards">
              <span>Tüm Kartları Göster</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM13 14H15V11H18V9H15V6H13V9H10V11H13V14Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
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
          <div *ngFor="let card of popularCards" class="card-wrapper">
            <div class="card-container" (click)="viewCard(card.username, $event)">
              <app-card-item [card]="transformToCardItem(card)" [maxSkills]="3"></app-card-item>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  popularCards: DigitalCardResponse[] = [];

  constructor(
    public authService: AuthService,
    private digitalCardService: DigitalCardService
  ) {}

  ngOnInit(): void {
    this.loadPopularCards();
  }

  loadPopularCards(): void {
    this.digitalCardService.getAllDigitalCards().subscribe({
      next: (cards) => {
        this.popularCards = cards.filter(card => 
          card.username === 'deneme' || card.username === 'berk'
        );
      },
      error: (error) => {
        console.error('Kartlar yüklenirken hata oluştu:', error);
      }
    });
  }

  transformToCardItem(card: DigitalCardResponse): any {
    return {
      id: card.id.toString(),
      fullName: card.fullName,
      title: card.title || '',
      profileImage: card.profilePhotoUrl || '',
      biography: card.biography || '',
      socialLinks: card.socialMediaLinks.reduce((acc, link) => {
        acc[link.platform.toLowerCase()] = link.url;
        return acc;
      }, {} as { [key: string]: string }),
      skills: card.skills
    };
  }

  viewCard(username: string, event: MouseEvent): void {
    // Eğer tıklanan element bir link ise kartın açılmasını engelle
    const target = event.target as HTMLElement;
    if (target.closest('a')) {
      event.stopPropagation();
      return;
    }
    
    window.location.href = `/card/${username}`;
  }
}
