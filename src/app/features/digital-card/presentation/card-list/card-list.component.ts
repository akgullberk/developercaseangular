import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DigitalCardService, DigitalCardResponse } from '../../data/services/digital-card.service';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card-list-container">
      <h2>Dijital Kartlar</h2>
      <div class="cards-grid">
        <div *ngFor="let card of cards" class="card-item">
          <div class="card-content">
            <h3>{{ card.fullName }}</h3>
            <p class="title">{{ card.title }}</p>
            <p class="biography">{{ card.biography }}</p>
            <div class="skills">
              <span *ngFor="let skill of card.skills" class="skill-tag">
                {{ skill }}
              </span>
            </div>
            <div class="social-links">
              <a *ngFor="let link of card.socialMediaLinks" 
                 [href]="link.url" 
                 target="_blank" 
                 class="social-link"
                 [title]="link.customName || link.platform">
                <i [class]="'fab fa-' + link.platform.toLowerCase()"></i>
              </a>
            </div>
            <a [routerLink]="['/cards', card.username]" class="view-profile">
              Profili Görüntüle
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-list-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;

      h2 {
        color: #2D3748;
        margin-bottom: 2rem;
        text-align: center;
      }
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .card-item {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .card-content {
      padding: 1.5rem;

      h3 {
        color: #2D3748;
        margin-bottom: 0.5rem;
      }

      .title {
        color: #4A5568;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }

      .biography {
        color: #718096;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .skill-tag {
        background: #EDF2F7;
        color: #4A5568;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
      }
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;

      .social-link {
        color: #4A5568;
        font-size: 1.2rem;
        transition: color 0.2s;

        &:hover {
          color: #FF6B00;
        }
      }
    }

    .view-profile {
      display: block;
      text-align: center;
      background: #FF6B00;
      color: white;
      padding: 0.75rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s;

      &:hover {
        background: #E65C00;
        transform: translateY(-2px);
      }
    }
  `]
})
export class CardListComponent implements OnInit {
  cards: DigitalCardResponse[] = [];

  constructor(private digitalCardService: DigitalCardService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.digitalCardService.getCards().subscribe({
      next: (cards: DigitalCardResponse[]) => {
        this.cards = cards;
      },
      error: (error) => {
        console.error('Kartlar yüklenirken hata oluştu:', error);
      }
    });
  }
}
