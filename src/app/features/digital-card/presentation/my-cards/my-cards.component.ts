import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DigitalCard } from '../../domain/models/digital-card.model';
import { DigitalCardService } from '../../data/services/digital-card.service';
import { CardItemComponent } from '../card-item/card-item.component';
import { AuthService } from '../../../auth/data/services/auth.service';

@Component({
  selector: 'app-my-cards',
  standalone: true,
  imports: [CommonModule, RouterModule, CardItemComponent],
  template: `
    <div class="my-cards-container">
      <div class="header">
        <h1>Dijital Kartlarım</h1>
        <button class="create-new-btn" routerLink="/create-card">
          <i class="fas fa-plus"></i>
          Yeni Kart Oluştur
        </button>
      </div>

      <div class="cards-grid" *ngIf="cards.length > 0; else noCards">
        <app-card-item 
          *ngFor="let card of cards" 
          [card]="card"
          (click)="onCardClick(card.id)"
        ></app-card-item>
      </div>

      <ng-template #noCards>
        <div class="no-cards">
          <div class="empty-state">
            <i class="fas fa-id-card"></i>
            <h2>Henüz Dijital Kartınız Yok</h2>
            <p>İlk dijital kartınızı oluşturmak için hemen başlayın!</p>
            <button class="create-first-btn" routerLink="/create-card">
              İlk Kartımı Oluştur
            </button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .my-cards-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;

        h1 {
          font-size: 2rem;
          color: #2D3748;
          margin: 0;
        }

        .create-new-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #FF6B00;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
          }

          i {
            font-size: 1.1rem;
          }
        }
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .no-cards {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;

        .empty-state {
          text-align: center;
          padding: 3rem;
          background: #F7FAFC;
          border-radius: 1rem;
          max-width: 500px;

          i {
            font-size: 4rem;
            color: #FF6B00;
            margin-bottom: 1.5rem;
          }

          h2 {
            color: #2D3748;
            margin-bottom: 1rem;
          }

          p {
            color: #718096;
            margin-bottom: 2rem;
          }

          .create-first-btn {
            padding: 1rem 2rem;
            background: #FF6B00;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .my-cards-container {
        padding: 1rem;

        .header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;

          .create-new-btn {
            width: 100%;
            justify-content: center;
          }
        }

        .cards-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  `]
})
export class MyCardsComponent implements OnInit {
  cards: DigitalCard[] = [];

  constructor(
    private digitalCardService: DigitalCardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.digitalCardService.getCards().subscribe(cards => {
      this.cards = cards;
    });
  }

  onCardClick(cardId: string): void {
    // Kart detay sayfasına yönlendirme yapılacak
    console.log('Kart tıklandı:', cardId);
  }
} 