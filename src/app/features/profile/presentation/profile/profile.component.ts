import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UserProfile } from '../../../auth/data/services/auth.service';
import { finalize } from 'rxjs/operators';
import { DigitalCardService, DigitalCardResponse } from '../../../digital-card/data/services/digital-card.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Profil Bilgilerim</h1>
        <p>Hesap bilgilerinizi buradan yönetebilirsiniz</p>
      </div>

      <div class="profile-content">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
          <div class="form-section">
            <h2>Kişisel Bilgiler</h2>

            <div class="form-group">
              <label for="username">Kullanıcı Adı</label>
              <input
                type="text"
                id="username"
                [value]="userProfile?.username"
                readonly
                class="readonly-input"
              >
            </div>

            <div class="form-group">
              <label for="email">E-posta</label>
              <input
                type="email"
                id="email"
                [value]="userProfile?.email"
                readonly
                class="readonly-input"
              >
            </div>
          </div>
        </form>

        <div class="profile-sidebar">
          <div class="profile-card">
            <div class="profile-avatar">
              <span>{{ getInitials() }}</span>
            </div>
            <h3>{{ getFullName() }}</h3>
            <p>{{ userProfile?.email }}</p>
            <p class="username">Kullanıcı adı: {{ userProfile?.username }}</p>
          </div>

          <div class="quick-links">
            <h3>Hızlı Erişim</h3>
            <ul>
              <li>
                <a routerLink="/my-cards">
                  <i class="fas fa-id-card"></i>
                  Dijital Kartım
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;

      .profile-header {
        text-align: center;
        margin-bottom: 3rem;

        h1 {
          font-size: 2.5rem;
          color: #2D3748;
          margin-bottom: 0.5rem;
        }

        p {
          color: #718096;
          font-size: 1.1rem;
        }
      }

      .profile-content {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 2rem;

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
        }
      }

      .profile-form {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #E2E8F0;

          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }

          h2 {
            color: #2D3748;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }
        }

        .form-group {
          margin-bottom: 1.5rem;

          label {
            display: block;
            margin-bottom: 0.5rem;
            color: #4A5568;
            font-weight: 500;
          }

          input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #E2E8F0;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s;

            &:focus {
              outline: none;
              border-color: #FF6B00;
              box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
            }

            &[readonly] {
              background: #F7FAFC;
              cursor: not-allowed;
            }
          }
        }
      }

      .profile-sidebar {
        .profile-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;

          .profile-avatar {
            width: 100px;
            height: 100px;
            background: #FF6B00;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: white;
            font-size: 2rem;
            font-weight: 500;
          }

          h3 {
            color: #2D3748;
            margin-bottom: 0.5rem;
          }

          p {
            color: #718096;
          }
        }

        .quick-links {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

          h3 {
            color: #2D3748;
            margin-bottom: 1rem;
          }

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              margin-bottom: 0.5rem;

              &:last-child {
                margin-bottom: 0;
              }

              a {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                color: #4A5568;
                text-decoration: none;
                border-radius: 0.5rem;
                transition: all 0.2s;

                &:hover {
                  background: #F7FAFC;
                  color: #FF6B00;
                }

                i {
                  width: 20px;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;

        .profile-header {
          margin-bottom: 2rem;

          h1 {
            font-size: 2rem;
          }
        }

        .profile-form {
          padding: 1.5rem;
        }
      }
    }

    .readonly-input {
      background-color: #F7FAFC !important;
      cursor: not-allowed !important;
    }

    .username {
      color: #718096;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  userProfile: UserProfile | null = null;
  digitalCard: DigitalCardResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private digitalCardService: DigitalCardService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadDigitalCardFullName();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getUserProfile()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.profileForm.patchValue({
            name: profile.name,
            surname: profile.surname
          });
        },
        error: (error) => {
          console.error('Profil bilgileri yüklenirken hata oluştu:', error);
          // TODO: Hata mesajı göster
        }
      });
  }

  loadDigitalCardFullName(): void {
    this.authService.getUserProfile().subscribe(profile => {
      this.digitalCardService.getDigitalCard(profile.username).subscribe(card => {
        this.digitalCard = card;
      });
    });
  }

  getInitials(): string {
    if (this.digitalCard) {
      return this.digitalCard.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (!this.userProfile) return '';
    return `${this.userProfile.name[0]}${this.userProfile.surname[0]}`.toUpperCase();
  }

  getFullName(): string {
    if (this.digitalCard) {
      return this.digitalCard.fullName;
    }
    if (!this.userProfile) return '';
    return `${this.userProfile.name} ${this.userProfile.surname}`;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const updateData = {
        name: this.profileForm.get('name')?.value,
        surname: this.profileForm.get('surname')?.value
      };

      this.authService.updateUserProfile(updateData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (updatedProfile) => {
            this.userProfile = updatedProfile;
            // TODO: Başarılı güncelleme mesajı göster
          },
          error: (error) => {
            console.error('Profil güncellenirken hata oluştu:', error);
            // TODO: Hata mesajı göster
          }
        });
    }
  }
}
