import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DigitalCardService, CardWithProjectsDTO } from '../data/services/digital-card.service';
import { AuthService } from '../../auth/data/services/auth.service';
import { ContactService, ContactFormData } from '../data/services/contact.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="card-detail-container" *ngIf="cardData">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="profile-photo">
            <img [src]="cardData.digitalCard.profilePhotoUrl || 'assets/default-profile.png'" [alt]="cardData.digitalCard.fullName">
          </div>
          <h1>{{ cardData.digitalCard.fullName }}</h1>
          <p class="title">{{ cardData.digitalCard.title }}</p>
          <button class="contact-btn" (click)="showContactForm = true">
            <i class="fas fa-envelope"></i>
            Bana Ulaş
          </button>
        </div>
      </div>

      <div class="content-container">
        <!-- Biyografi -->
        <section class="detail-card">
          <h2>Hakkında</h2>
          <p class="biography">{{ cardData.digitalCard.biography }}</p>
        </section>

        <!-- Yetenekler -->
        <section class="detail-card">
          <h2>Yetenekler</h2>
          <div class="skills-container">
            <span class="skill-tag" *ngFor="let skill of cardData.digitalCard.skills">
              {{ skill }}
            </span>
          </div>
        </section>

        <!-- Sosyal Medya -->
        <section class="detail-card">
          <h2>Sosyal Medya</h2>
          <div class="social-links">
            <a *ngFor="let link of cardData.digitalCard.socialMediaLinks"
               [href]="link.url"
               target="_blank"
               class="social-link">
              <i class="fab" [ngClass]="getSocialIcon(link.platform)"></i>
              {{ link.customName || link.platform }}
            </a>
          </div>
        </section>

        <!-- Projeler -->
        <section class="detail-card">
          <h2>Projeler</h2>
          <div class="projects-grid">
            <div *ngFor="let project of cardData.projects" class="project-card">
              <div class="project-header">
                <i class="fas fa-code project-icon"></i>
                <h4>{{ project.name }}</h4>
              </div>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-tags">
                <span *ngFor="let tech of getDisplayedTechnologies(project.technologies)">{{ tech }}</span>
                <span *ngIf="hasMoreTechnologies(project.technologies)" class="more-tag">
                  +{{ getRemainingTechnologiesCount(project.technologies) }}
                </span>
              </div>
              <div class="project-actions">
                <a *ngIf="project.githubLink" [href]="project.githubLink" target="_blank" class="github-link">
                  <i class="fab fa-github"></i>
                  GitHub
                </a>
                <button class="project-link" (click)="viewProject(project.id)">
                  <i class="fas fa-external-link-alt"></i>
                  Projeyi İncele
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Contact Form Modal -->
      <div class="modal-overlay" *ngIf="showContactForm">
        <div class="modal-content">
          <div class="modal-header">
            <h3>İletişim Formu</h3>
            <button class="close-btn" (click)="showContactForm = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
            <div class="form-group">
              <label for="name">İsim</label>
              <input type="text" id="name" formControlName="name" placeholder="Adınız">
              <div class="error-message" *ngIf="contactForm.get('name')?.errors?.['required'] && contactForm.get('name')?.touched">
                İsim alanı zorunludur
              </div>
            </div>

            <div class="form-group">
              <label for="email">E-posta</label>
              <input type="email" id="email" formControlName="email" placeholder="E-posta adresiniz">
              <div class="error-message" *ngIf="contactForm.get('email')?.errors?.['required'] && contactForm.get('email')?.touched">
                E-posta alanı zorunludur
              </div>
              <div class="error-message" *ngIf="contactForm.get('email')?.errors?.['email'] && contactForm.get('email')?.touched">
                Geçerli bir e-posta adresi giriniz
              </div>
            </div>

            <div class="form-group">
              <label for="subject">Konu</label>
              <input type="text" id="subject" formControlName="subject" placeholder="Mesajınızın konusu">
              <div class="error-message" *ngIf="contactForm.get('subject')?.errors?.['required'] && contactForm.get('subject')?.touched">
                Konu alanı zorunludur
              </div>
            </div>

            <div class="form-group">
              <label for="message">Mesaj</label>
              <textarea id="message" formControlName="message" rows="5" placeholder="Mesajınız"></textarea>
              <div class="error-message" *ngIf="contactForm.get('message')?.errors?.['required'] && contactForm.get('message')?.touched">
                Mesaj alanı zorunludur
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="showContactForm = false">İptal</button>
              <button type="submit" class="submit-btn" [disabled]="contactForm.invalid || isSubmitting">
                <span *ngIf="!isSubmitting">Gönder</span>
                <i *ngIf="isSubmitting" class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Success Message Modal -->
      <div class="modal-overlay" *ngIf="showSuccessMessage">
        <div class="modal-content success-message">
          <i class="fas fa-check-circle"></i>
          <h3>Mesajınız Gönderildi!</h3>
          <p>İletişime geçtiğiniz için teşekkür ederiz.</p>
          <button class="ok-btn" (click)="showSuccessMessage = false">Tamam</button>
        </div>
      </div>
    </div>

    <div class="loading-container" *ngIf="!cardData">
      <div class="loading-spinner"></div>
      <p>Kart detayları yükleniyor...</p>
    </div>

    <!-- Giriş Yapma Uyarısı Modal -->
    <div class="login-alert" *ngIf="showLoginAlert">
      <div class="login-alert-content">
        <h3>Giriş Yapmanız Gerekiyor</h3>
        <p>Projeyi incelemek için lütfen giriş yapın.</p>
        <div class="login-alert-actions">
          <button class="cancel-btn" (click)="showLoginAlert = false">İptal</button>
          <button class="login-btn" (click)="goToLogin()">Giriş Yap</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-detail-container {
      min-height: 100vh;
      background: #f8fafc;
      padding-top: 64px;
    }

    .hero-section {
      background: linear-gradient(135deg, #FF6B00, #FF8533);
      padding: 4rem 2rem;
      color: white;
      position: relative;
      margin-top: -64px;
      padding-top: calc(64px + 4rem);
      text-align: center;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;

      .profile-photo {
        width: 150px;
        height: 150px;
        margin: 0 auto 2rem;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid rgba(255, 255, 255, 0.2);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      h1 {
        font-size: 2.5rem;
        margin: 0 0 0.5rem;
      }

      .title {
        font-size: 1.25rem;
        opacity: 0.9;
      }
    }

    .content-container {
      max-width: 1200px;
      margin: -2rem auto 0;
      padding: 0 2rem;
      position: relative;
    }

    .detail-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      h2 {
        color: #2D3748;
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #EDF2F7;
      }
    }

    .biography {
      color: #4A5568;
      font-size: 1.1rem;
      line-height: 1.8;
    }

    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;

      .skill-tag {
        background: #F7FAFC;
        color: #4A5568;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
      }
    }

    .social-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;

      .social-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: #F7FAFC;
        color: #2D3748;
        text-decoration: none;
        border-radius: 0.5rem;
        transition: all 0.2s;

        &:hover {
          background: #FF6B00;
          color: white;
        }

        i {
          font-size: 1.25rem;
        }
      }
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .project-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
      min-width: 350px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 300px;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
      }
    }

    .project-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-shrink: 0;

      .project-icon {
        font-size: 1.5rem;
        color: #FF6B00;
      }

      h4 {
        color: #2D3748;
        font-size: 1.25rem;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 250px;
      }
    }

    .project-description {
      color: #4A5568;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 4.8em;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      flex-grow: 1;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-shrink: 0;

      span {
        background: #F7FAFC;
        color: #4A5568;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
      }

      .more-tag {
        background: #EDF2F7;
        color: #718096;
        font-weight: 500;
      }
    }

    .project-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: auto;
      flex-shrink: 0;
    }

    .project-link, .github-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #FF6B00;
      background: none;
      border: none;
      padding: 0;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s;
      text-decoration: none;

      &:hover {
        color: #E65C00;
      }

      i {
        font-size: 0.875rem;
      }
    }

    .github-link {
      color: #24292e;

      &:hover {
        color: #000000;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 1rem;

      p {
        color: #4A5568;
        font-size: 1.1rem;
      }
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #EDF2F7;
      border-top: 4px solid #FF6B00;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 3rem 1rem;
      }

      .content-container {
        padding: 0 1rem;
      }

      .detail-card {
        padding: 1.5rem;
      }

      .hero-content {
        h1 {
          font-size: 2rem;
        }
      }
    }

    .login-alert {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .login-alert-content {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
      text-align: center;

      h3 {
        color: #2D3748;
        margin-bottom: 1rem;
      }

      p {
        color: #4A5568;
        margin-bottom: 1.5rem;
      }
    }

    .login-alert-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;

      button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .cancel-btn {
        background: #EDF2F7;
        color: #4A5568;
        border: none;

        &:hover {
          background: #E2E8F0;
        }
      }

      .login-btn {
        background: #FF6B00;
        color: white;
        border: none;

        &:hover {
          background: #E65C00;
        }
      }
    }

    .contact-btn {
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: white;
      color: #FF6B00;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        background: #FF6B00;
        color: white;
        transform: translateY(-2px);
      }

      i {
        font-size: 1.1rem;
      }
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      width: 100%;
      max-width: 500px;
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h3 {
        color: #2D3748;
        margin: 0;
      }

      .close-btn {
        background: none;
        border: none;
        color: #718096;
        cursor: pointer;
        font-size: 1.25rem;
        padding: 0.5rem;
        transition: color 0.2s;

        &:hover {
          color: #2D3748;
        }
      }
    }

    .contact-form {
      .form-group {
        margin-bottom: 1.5rem;

        label {
          display: block;
          color: #4A5568;
          margin-bottom: 0.5rem;
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
        }

        textarea {
          resize: vertical;
        }

        .error-message {
          color: #E53E3E;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;

      button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .cancel-btn {
        background: #EDF2F7;
        color: #4A5568;
        border: none;

        &:hover:not(:disabled) {
          background: #E2E8F0;
        }
      }

      .submit-btn {
        background: #FF6B00;
        color: white;
        border: none;

        &:hover:not(:disabled) {
          background: #E65C00;
        }
      }
    }

    .success-message {
      text-align: center;
      padding: 3rem 2rem;

      i {
        font-size: 4rem;
        color: #48BB78;
        margin-bottom: 1.5rem;
      }

      h3 {
        color: #2D3748;
        margin-bottom: 0.5rem;
      }

      p {
        color: #718096;
        margin-bottom: 2rem;
      }

      .ok-btn {
        background: #48BB78;
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #38A169;
        }
      }
    }
  `]
})
export class CardDetailComponent implements OnInit {
  cardData: CardWithProjectsDTO | null = null;
  showLoginAlert = false;
  showContactForm = false;
  showSuccessMessage = false;
  isSubmitting = false;
  contactForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private digitalCardService: DigitalCardService,
    private authService: AuthService,
    private contactService: ContactService,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadCardDetails(params['id']);
      }
    });
  }

  loadCardDetails(username: string): void {
    this.digitalCardService.getCardWithProjects(username).subscribe({
      next: (data) => {
        this.cardData = data;
      },
      error: (error) => {
        console.error('Kart detayları yüklenirken hata:', error);
        this.router.navigate(['/all-cards']);
      }
    });
  }

  getSocialIcon(platform: string): string {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case 'github':
        return 'fa-github';
      case 'twitter':
        return 'fa-twitter';
      case 'linkedin':
        return 'fa-linkedin';
      case 'instagram':
        return 'fa-instagram';
      default:
        return 'fa-link';
    }
  }

  getDisplayedTechnologies(technologies: string[]): string[] {
    return technologies.slice(0, 4);
  }

  hasMoreTechnologies(technologies: string[]): boolean {
    return technologies.length > 4;
  }

  getRemainingTechnologiesCount(technologies: string[]): number {
    return technologies.length - 4;
  }

  viewProject(projectId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.showLoginAlert = true;
    } else {
      this.router.navigate(['/project', projectId]);
    }
  }

  goToLogin(): void {
    this.showLoginAlert = false;
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (this.contactForm.valid && this.cardData) {
      this.isSubmitting = true;
      const formData: ContactFormData = {
        ...this.contactForm.value,
        recipientUsername: this.cardData.digitalCard.username
      };

      this.contactService.sendContactForm(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showContactForm = false;
          this.showSuccessMessage = true;
          this.contactForm.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('İletişim formu gönderilirken hata:', error);
          // Hata mesajı gösterilebilir
        }
      });
    }
  }
} 