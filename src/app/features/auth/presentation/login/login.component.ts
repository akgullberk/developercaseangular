import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-content">
        <h2>Giriş Yap</h2>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Kullanıcı Adı</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username"
              placeholder="Kullanıcı adınızı girin"
            >
            <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.errors" class="error-text">
              <span *ngIf="loginForm.get('username')?.errors?.['required']">Kullanıcı adı zorunludur</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Şifre</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              placeholder="Şifrenizi girin"
            >
            <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors" class="error-text">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Şifre zorunludur</span>
            </div>
          </div>

          <button type="submit" class="login-btn" [disabled]="!loginForm.valid || isLoading">
            {{ isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #F7FAFC;
      padding: 1rem;
    }

    .login-content {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;

      h2 {
        color: #2D3748;
        margin-bottom: 2rem;
        text-align: center;
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

        &::placeholder {
          color: #A0AEC0;
        }
      }
    }

    .error-text {
      color: #E53E3E;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .error-message {
      background-color: #FEE2E2;
      border: 1px solid #FCA5A5;
      color: #DC2626;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .login-btn {
      width: 100%;
      padding: 0.75rem;
      background: #FF6B00;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #E65C00;
        transform: translateY(-2px);
      }

      &:disabled {
        background: #CBD5E0;
        cursor: not-allowed;
        transform: none;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storage: StorageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const { username, password } = this.loginForm.value;

      // Örnek login işlemi - gerçek uygulamada API'ye istek atılacak
      setTimeout(() => {
        // Başarılı login simülasyonu
        const token = 'dummy-token-' + Math.random();
        this.storage.setItem('token', token);
        this.storage.setItem('username', username); // Username'i kaydet
        
        this.router.navigate(['/my-cards']);
        this.isLoading = false;
      }, 1000);

      // Gerçek API entegrasyonu için:
      /*
      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.storage.setItem('token', response.token);
          this.storage.setItem('username', username);
          this.router.navigate(['/my-cards']);
        },
        error: (error) => {
          console.error('Login hatası:', error);
          this.errorMessage = 'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.';
          this.isLoading = false;
        }
      });
      */
    }
  }
} 