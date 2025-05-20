import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DigitalCardService, DigitalCardRequest, SocialMediaLink } from '../../data/services/digital-card.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="create-card-container">
      <div class="create-card-content">
        <h2>Yeni Dijital Kart Oluştur</h2>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

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

            <div class="form-group">
              <label for="instagram">Instagram</label>
              <input 
                type="text" 
                id="instagram" 
                formControlName="instagram"
                placeholder="Instagram profiliniz"
              >
            </div>

            <div formArrayName="additionalLinks">
              <div *ngFor="let link of additionalLinks.controls; let i = index" [formGroupName]="i" class="additional-link">
                <div class="form-group">
                  <div class="link-header">
                    <label [for]="'linkTitle' + i">Bağlantı Başlığı</label>
                    <button type="button" class="remove-btn" (click)="removeLink(i)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    [id]="'linkTitle' + i" 
                    formControlName="title"
                    placeholder="Örn: Kişisel Blog"
                  >
                </div>
                <div class="form-group">
                  <label [for]="'linkUrl' + i">Bağlantı URL</label>
                  <input 
                    type="url" 
                    [id]="'linkUrl' + i" 
                    formControlName="url"
                    placeholder="https://..."
                  >
                </div>
              </div>
            </div>

            <button type="button" class="add-link-btn" (click)="addLink()">
              <i class="fas fa-plus"></i> Yeni Bağlantı Ekle
            </button>
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

        .additional-link {
          background: white;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #E2E8F0;

          .link-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            .remove-btn {
              background: none;
              border: none;
              color: #E53E3E;
              cursor: pointer;
              padding: 0.25rem;
              font-size: 0.9rem;
              transition: all 0.2s;

              &:hover {
                color: #C53030;
                transform: scale(1.1);
              }
            }
          }
        }

        .add-link-btn {
          width: 100%;
          padding: 0.75rem;
          background: #EDF2F7;
          border: 2px dashed #CBD5E0;
          border-radius: 0.5rem;
          color: #4A5568;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;

          i {
            font-size: 0.8rem;
          }

          &:hover {
            background: #E2E8F0;
            border-color: #A0AEC0;
            color: #2D3748;
          }
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

    .error-message {
      background-color: #FEE2E2;
      border: 1px solid #FCA5A5;
      color: #DC2626;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      white-space: pre-line;
    }
  `]
})
export class CreateCardComponent {
  cardForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private digitalCardService: DigitalCardService,
    private router: Router
  ) {
    this.cardForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      biography: ['', [Validators.required, Validators.maxLength(1000)]],
      profileImage: [''],
      github: ['', [Validators.pattern('https?://.+')]],
      linkedin: ['', [Validators.pattern('https?://.+')]],
      twitter: ['', [Validators.pattern('https?://.+')]],
      instagram: ['', [Validators.pattern('https?://.+')]],
      skills: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,]+$/)]],
      additionalLinks: this.fb.array([])
    });
  }

  get additionalLinks() {
    return this.cardForm.get('additionalLinks') as FormArray;
  }

  addLink() {
    const linkGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      url: ['', [Validators.required, Validators.pattern('https?://.+'), Validators.maxLength(500)]]
    });

    this.additionalLinks.push(linkGroup);
  }

  removeLink(index: number) {
    this.additionalLinks.removeAt(index);
  }

  private prepareSocialMediaLinks(): SocialMediaLink[] {
    const links: SocialMediaLink[] = [];
    const formValue = this.cardForm.value;

    // Standart sosyal medya bağlantıları
    if (formValue.github) {
      links.push({ 
        platform: 'GITHUB', 
        url: formValue.github,
        customName: 'GitHub'
      });
    }
    if (formValue.linkedin) {
      links.push({ 
        platform: 'LINKEDIN', 
        url: formValue.linkedin,
        customName: 'LinkedIn'
      });
    }
    if (formValue.twitter) {
      links.push({ 
        platform: 'TWITTER', 
        url: formValue.twitter,
        customName: 'Twitter'
      });
    }
    if (formValue.instagram) {
      links.push({ 
        platform: 'INSTAGRAM', 
        url: formValue.instagram,
        customName: 'Instagram'
      });
    }

    // Ek bağlantılar
    formValue.additionalLinks?.forEach((link: any) => {
      if (link.url && link.title) {
        links.push({
          platform: 'OTHER',
          url: link.url,
          customName: link.title
        });
      }
    });

    return links;
  }

  private prepareSkills(): string[] {
    const skillsString = this.cardForm.get('skills')?.value || '';
    return skillsString
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length >= 2 && skill.length <= 50);
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const formValue = this.cardForm.value;
      const cardData: DigitalCardRequest = {
        fullName: formValue.fullName,
        profilePhotoUrl: formValue.profileImage || undefined,
        title: formValue.title,
        biography: formValue.biography,
        socialMediaLinks: this.prepareSocialMediaLinks(),
        skills: this.prepareSkills()
      };

      console.log('Gönderilecek veri:', cardData); // Debug için

      this.digitalCardService.createDigitalCard(cardData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (response) => {
            console.log('Kart başarıyla oluşturuldu:', response);
            this.router.navigate(['/my-cards']);
          },
          error: (error) => {
            console.error('Kart oluşturulurken hata:', error);
            if (error.error) {
              if (typeof error.error === 'object') {
                // Backend'den gelen validasyon hatalarını işle
                const errorMessages = Object.entries(error.error)
                  .map(([field, message]) => `${field}: ${message}`)
                  .join('\n');
                this.errorMessage = errorMessages;
              } else if (typeof error.error === 'string') {
                this.errorMessage = error.error;
              } else {
                this.errorMessage = 'Kart oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
              }
            } else {
              this.errorMessage = 'Sunucu ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.';
            }
          }
        });
    } else {
      this.markFormGroupTouched(this.cardForm);
      this.errorMessage = 'Lütfen tüm zorunlu alanları doldurun ve geçerli değerler girin.';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 