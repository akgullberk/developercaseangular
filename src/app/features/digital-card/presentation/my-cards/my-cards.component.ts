import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DigitalCardService, DigitalCardResponse } from '../../data/services/digital-card.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-my-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="my-cards-container">
      <div class="header">
        <h2>Dijital Kartlarım</h2>
        <a routerLink="/create-card" class="create-btn" *ngIf="!card">
          <i class="fas fa-plus"></i>
          Yeni Kart Oluştur
        </a>
      </div>

      <div *ngIf="card" class="card-item">
        <div class="card-content">
          <div class="card-header">
            <h3>{{ card.fullName }}</h3>
            <div class="actions">
              <button class="edit-btn" [routerLink]="['/cards', card.username, 'edit']">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn" (click)="deleteCard(card)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

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

      <div *ngIf="!card && !isLoading" class="empty-state">
        <i class="fas fa-id-card"></i>
        <h3>Henüz dijital kartınız yok</h3>
        <p>İlk dijital kartınızı oluşturmak için "Yeni Kart Oluştur" butonuna tıklayın.</p>
        <a routerLink="/create-card" class="create-btn">
          <i class="fas fa-plus"></i>
          Yeni Kart Oluştur
        </a>
      </div>

      <div *ngIf="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Kartınız yükleniyor...</p>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .my-cards-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        color: #2D3748;
        margin: 0;
      }
    }

    .create-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #FF6B00;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s;

      &:hover {
        background: #E65C00;
        transform: translateY(-2px);
      }

      i {
        font-size: 0.9rem;
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
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;

      h3 {
        color: #2D3748;
        margin: 0;
      }

      .actions {
        display: flex;
        gap: 0.5rem;

        button {
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 0.25rem;

          &:hover {
            background: #EDF2F7;
          }

          &.edit-btn {
            color: #4299E1;

            &:hover {
              color: #2B6CB0;
            }
          }

          &.delete-btn {
            color: #E53E3E;

            &:hover {
              color: #C53030;
            }
          }
        }
      }
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

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      i {
        font-size: 4rem;
        color: #CBD5E0;
        margin-bottom: 1rem;
      }

      h3 {
        color: #2D3748;
        margin-bottom: 0.5rem;
      }

      p {
        color: #718096;
        margin-bottom: 2rem;
      }

      .create-btn {
        display: inline-flex;
      }
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      i {
        font-size: 2rem;
        color: #FF6B00;
        margin-bottom: 1rem;
      }

      p {
        color: #4A5568;
      }
    }

    .error-message {
      background-color: #FEE2E2;
      border: 1px solid #FCA5A5;
      color: #DC2626;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1.5rem;
      text-align: center;
    }
  `]
})
export class MyCardsComponent implements OnInit {
  card: DigitalCardResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private digitalCardService: DigitalCardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCard();
  }

  loadCard(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const username = this.authService.getCurrentUsername();
    if (!username) {
      this.errorMessage = 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.';
      this.isLoading = false;
      return;
    }

    this.digitalCardService.getDigitalCard(username).subscribe({
      next: (card: DigitalCardResponse) => {
        this.card = card;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kart yüklenirken hata oluştu:', error);
        if (error.status === 404) {
          // Kart bulunamadıysa boş durumu göster
          this.card = null;
        } else {
          this.errorMessage = 'Kartınız yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        this.isLoading = false;
      }
    });
  }

  deleteCard(card: DigitalCardResponse): void {
    if (confirm('Bu kartı silmek istediğinizden emin misiniz?')) {
      this.digitalCardService.deleteDigitalCard().subscribe({
        next: () => {
          this.card = null;
        },
        error: (error) => {
          console.error('Kart silinirken hata oluştu:', error);
          this.errorMessage = 'Kart silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
      });
    }
  }
} 