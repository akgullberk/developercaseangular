import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DigitalCardService, DigitalCardResponse } from '../../data/services/digital-card.service';
import { AuthService } from '../../../auth/data/services/auth.service';
import { CardItemComponent } from '../card-item/card-item.component';
import { DigitalCard } from '../../domain/models/digital-card.model';

@Component({
  selector: 'app-my-cards',
  standalone: true,
  imports: [CommonModule, RouterModule, CardItemComponent],
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss']
})
export class MyCardsComponent implements OnInit, AfterViewInit {
  @ViewChild('skillsContainer') skillsContainer!: ElementRef<HTMLDivElement>;
  card: DigitalCardResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  maxVisibleSkills = 3;
  visibleSkillCount = this.maxVisibleSkills;

  constructor(
    private digitalCardService: DigitalCardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCard();
  }

  ngAfterViewInit() {
    setTimeout(() => this.adjustSkillsToFit(), 0);
  }

  ngAfterViewChecked() {
    setTimeout(() => this.adjustSkillsToFit(), 0);
  }

  adjustSkillsToFit() {
    if (!this.skillsContainer || !this.card) return;
    let count = this.maxVisibleSkills;
    const el = this.skillsContainer.nativeElement;
    while (count > 0) {
      this.visibleSkillCount = count;
      if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
        count--;
      } else {
        break;
      }
    }
    this.visibleSkillCount = count;
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getSocialIconClass(platform: string): string {
    const p = platform ? platform.toLowerCase() : '';
    if (p.includes('github')) return 'fab fa-github';
    if (p.includes('linkedin')) return 'fab fa-linkedin';
    if (p.includes('twitter')) return 'fab fa-twitter';
    return 'fas fa-link';
  }

  getShortBiography(bio: string | undefined): string {
    if (!bio) return '';
    return bio.length > 120 ? bio.slice(0, 120) + '...' : bio;
  }

  getVisibleSkills(skills: string[], count: number = this.visibleSkillCount): string[] {
    return skills ? skills.slice(0, count) : [];
  }

  getHiddenSkillsCount(skills: string[], count: number = this.visibleSkillCount): number {
    return skills && skills.length > count ? skills.length - count : 0;
  }

  formatSkill(skill: string): string {
    if (!skill) return '';
    return skill.toLowerCase();
  }

  loadCard(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.digitalCardService.getDigitalCard(profile.username).subscribe({
          next: (card: DigitalCardResponse) => {
            this.card = card;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Kart yüklenirken hata oluştu:', error);
            if (error.status === 404) {
              this.card = null;
            } else {
              this.errorMessage = 'Kartınız yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
            }
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Kullanıcı profili yüklenirken hata oluştu:', error);
        this.errorMessage = 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.';
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

  goToEditCard() {
    this.router.navigate(['/edit-card']);
  }

  getCardItemData(card: DigitalCardResponse): DigitalCard {
    const socialLinks: { [key: string]: string } = {};
    if (card.socialMediaLinks) {
      card.socialMediaLinks.forEach(link => {
        let key = (link.platform || '').toLowerCase();
        if (key.includes('blog')) key = 'blog';
        if (key.includes('portfolio')) key = 'portfolio';
        if (key.includes('medium')) key = 'medium';
        if (key.includes('youtube')) key = 'youtube';
        if (key.includes('facebook')) key = 'facebook';
        socialLinks[key] = link.url;
      });
    }
    return {
      id: String(card.id),
      fullName: card.fullName || '',
      title: card.title || '',
      profileImage: card.profilePhotoUrl || '',
      biography: card.biography || '',
      socialLinks,
      skills: card.skills || []
    };
  }
} 