import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DigitalCardService, CardWithProjectsDTO } from '../../data/services/digital-card.service';
import { AuthService } from '../../../auth/data/services/auth.service';
import { ContactService, ContactFormData } from '../../data/services/contact.service';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['username']) {
        this.loadCardDetails(params['username']);
      }
    });
  }

  loadCardDetails(username: string): void {
    this.digitalCardService.getCardWithProjects(username).subscribe({
      next: (data: CardWithProjectsDTO) => {
        this.cardData = data;
      },
      error: (error: unknown) => {
        console.error('Kart detayları yüklenirken hata oluştu:', error);
      }
    });
  }

  getSocialIcon(platform: string): string {
    const p = platform.toLowerCase();
    if (p.includes('github')) return 'fa-github';
    if (p.includes('linkedin')) return 'fa-linkedin';
    if (p.includes('twitter')) return 'fa-twitter';
    if (p.includes('instagram')) return 'fa-instagram';
    if (p.includes('blog')) return 'fa-globe';
    if (p.includes('portfolio')) return 'fa-briefcase';
    if (p.includes('medium')) return 'fa-medium';
    if (p.includes('youtube')) return 'fa-youtube';
    if (p.includes('facebook')) return 'fa-facebook';
        return 'fa-link';
  }

  getDisplayedTechnologies(technologies: string[]): string[] {
    return technologies.slice(0, 3);
  }

  hasMoreTechnologies(technologies: string[]): boolean {
    return technologies.length > 3;
  }

  getRemainingTechnologiesCount(technologies: string[]): number {
    return technologies.length - 3;
  }

  viewProject(projectId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.showLoginAlert = true;
      return;
    }
    this.router.navigate(['/projects', projectId]);
  }

  goToLogin(): void {
    this.showLoginAlert = false;
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting && this.cardData) {
      this.isSubmitting = true;

      const formData: ContactFormData = {
        recipientId: this.cardData.digitalCard.id,
        ...this.contactForm.value
      };

      this.contactService.sendContactForm(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showContactForm = false;
          this.showSuccessMessage = true;
          this.contactForm.reset();
        },
        error: (error: unknown) => {
          this.isSubmitting = false;
          console.error('Form gönderilirken hata oluştu:', error);
        }
      });
    }
  }
} 