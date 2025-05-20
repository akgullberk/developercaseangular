import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="create-card-container">
      <div class="create-card-content">
        <h2>Yeni Dijital Kart Oluştur</h2>
        
        <form [formGroup]="cardForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Başlık</label>
            <input 
              type="text" 
              id="title" 
              formControlName="title"
              placeholder="Örn: Senior Frontend Developer"
            >
          </div>

          <div class="form-group">
            <label for="fullName">Ad Soyad</label>
            <input 
              type="text" 
              id="fullName" 
              formControlName="fullName"
              placeholder="Örn: Ahmet Yılmaz"
            >
          </div>

          <div class="form-group">
            <label for="biography">Biyografi</label>
            <textarea 
              id="biography" 
              formControlName="biography"
              rows="4"
              placeholder="Kendinizi kısaca tanıtın..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="profileImage">Profil Fotoğrafı URL</label>
            <input 
              type="text" 
              id="profileImage" 
              formControlName="profileImage"
              placeholder="Profil fotoğrafınızın URL'si"
            >
          </div>

          <div class="social-links">
            <h3>Sosyal Medya Bağlantıları</h3>
            
            <div class="form-group">
              <label for="github">GitHub</label>
              <input 
                type="text" 
                id="github" 
                formControlName="github"
                placeholder="GitHub profiliniz"
              >
            </div>

            <div class="form-group">
              <label for="linkedin">LinkedIn</label>
              <input 
                type="text" 
                id="linkedin" 
                formControlName="linkedin"
                placeholder="LinkedIn profiliniz"
              >
            </div>

            <div class="form-group">
              <label for="twitter">Twitter</label>
              <input 
                type="text" 
                id="twitter" 
                formControlName="twitter"
                placeholder="Twitter profiliniz"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="skills">Yetenekler (virgülle ayırın)</label>
            <input 
              type="text" 
              id="skills" 
              formControlName="skills"
              placeholder="Örn: Angular, TypeScript, React"
            >
          </div>

          <div class="button-group">
            <button type="button" class="cancel-btn" routerLink="/">İptal</button>
            <button type="submit" class="submit-btn" [disabled]="!cardForm.valid || isLoading">
              {{ isLoading ? 'Oluşturuluyor...' : 'Kartı Oluştur' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .create-card-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;

      h2 {
        color: #2D3748;
        margin-bottom: 2rem;
        text-align: center;
      }

      .form-group {
        margin-bottom: 1.5rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4A5568;
          font-weight: 500;
        }

        input, textarea {
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

      .social-links {
        background: #F7FAFC;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;

        h3 {
          color: #2D3748;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
      }

      .button-group {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;

        button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            transform: translateY(-2px);
          }
        }

        .cancel-btn {
          background: transparent;
          border: 2px solid #FF6B00;
          color: #FF6B00;

          &:hover {
            background: rgba(255, 107, 0, 0.1);
          }
        }

        .submit-btn {
          background: #FF6B00;
          border: none;
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);

          &:hover {
            box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
          }

          &:disabled {
            background: #CBD5E0;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        }
      }
    }
  `]
})
export class CreateCardComponent {
  cardForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      fullName: ['', Validators.required],
      biography: ['', Validators.required],
      profileImage: [''],
      github: [''],
      linkedin: [''],
      twitter: [''],
      skills: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.isLoading = true;
      // Form verilerini işleme ve API'ye gönderme kodları buraya gelecek
      console.log('Form değerleri:', this.cardForm.value);
    }
  }
} 