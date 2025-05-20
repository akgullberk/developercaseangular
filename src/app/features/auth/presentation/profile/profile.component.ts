import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../data/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
              <label for="fullName">Ad Soyad</label>
              <input 
                type="text" 
                id="fullName" 
                formControlName="fullName"
                placeholder="Ad Soyad"
              >
            </div>

            <div class="form-group">
              <label for="email">E-posta</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                placeholder="E-posta adresiniz"
                readonly
              >
            </div>
          </div>

          <div class="form-section">
            <h2>Şifre Değiştir</h2>
            
            <div class="form-group">
              <label for="currentPassword">Mevcut Şifre</label>
              <input 
                type="password" 
                id="currentPassword" 
                formControlName="currentPassword"
                placeholder="Mevcut şifreniz"
              >
            </div>

            <div class="form-group">
              <label for="newPassword">Yeni Şifre</label>
              <input 
                type="password" 
                id="newPassword" 
                formControlName="newPassword"
                placeholder="Yeni şifreniz"
              >
            </div>

            <div class="form-group">
              <label for="confirmPassword">Yeni Şifre (Tekrar)</label>
              <input 
                type="password" 
                id="confirmPassword" 
                formControlName="confirmPassword"
                placeholder="Yeni şifrenizi tekrar girin"
              >
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="save-btn" [disabled]="!profileForm.valid || isLoading">
              {{ isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
            </button>
          </div>
        </form>

        <div class="profile-sidebar">
          <div class="profile-card">
            <div class="profile-avatar">
              <span>{{ getInitials(profileForm.get('fullName')?.value || '') }}</span>
            </div>
            <h3>{{ profileForm.get('fullName')?.value || 'Kullanıcı' }}</h3>
            <p>{{ profileForm.get('email')?.value || 'E-posta' }}</p>
          </div>

          <div class="quick-links">
            <h3>Hızlı Erişim</h3>
            <ul>
              <li>
                <a routerLink="/my-cards">
                  <i class="fas fa-id-card"></i>
                  Dijital Kartlarım
                </a>
              </li>
              <li>
                <a routerLink="/create-card">
                  <i class="fas fa-plus"></i>
                  Yeni Kart Oluştur
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

        .form-actions {
          margin-top: 2rem;

          .save-btn {
            width: 100%;
            padding: 1rem;
            background: #FF6B00;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.2s;

            &:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
            }

            &:disabled {
              background: #CBD5E0;
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
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Kullanıcı bilgilerini form'a yükle
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // TODO: AuthService'den kullanıcı bilgilerini al
    const mockUser = {
      fullName: 'Ahmet Yılmaz',
      email: 'ahmet@example.com'
    };

    this.profileForm.patchValue({
      fullName: mockUser.fullName,
      email: mockUser.email
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      // TODO: Profil güncelleme işlemleri
      console.log('Form değerleri:', this.profileForm.value);
      
      // Simüle edilmiş API çağrısı
      setTimeout(() => {
        this.isLoading = false;
        // Başarılı güncelleme mesajı göster
      }, 1000);
    }
  }
} 