import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalCard as BaseDigitalCard } from '../../domain/models/digital-card.model';
import { environment } from '../../../../../environments/environment';

export interface DigitalCard extends Omit<BaseDigitalCard, 'socialLinks'> {
  socialLinks: { [key: string]: string };
}

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-item custom-card">
      <div class="card-header-row">
        <div class="avatar">
          <ng-container *ngIf="card.profileImage && card.profileImage !== ''; else initials">
            <img [src]="getProfileImageUrl(card.profileImage)" alt="Avatar" (error)="card.profileImage = ''" />
          </ng-container>
          <ng-template #initials>
            <span>{{ getInitials(card.fullName) }}</span>
          </ng-template>
        </div>
        <div class="social-icons">
          <a *ngFor="let key of getSocialKeys()" [href]="card.socialLinks[key]" target="_blank" [title]="key">
            <i [ngClass]="getSocialIconClass(key)"></i>
          </a>
        </div>
      </div>
      <div class="card-main-content">
        <h3 class="fullname">{{ card.fullName }}</h3>
        <p class="title">{{ card.title }}</p>
        <p class="biography">{{ getShortBiography(card.biography) }}</p>
        <div class="skills">
          <span *ngFor="let skill of getVisibleSkills(card.skills)" class="skill-tag">{{ formatSkill(skill) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-card {
      background: linear-gradient(135deg, #ff9800 0%, #ff6b00 100%);
      color: #fff;
      border-radius: 1.5rem;
      box-shadow: 0 4px 24px rgba(255, 107, 0, 0.15);
      height: 310px;
      padding: 1rem 2rem 1rem 2rem;
      max-width: 600px;
      margin: 0 auto;
      position: relative;
      overflow: visible;
    }
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.2rem;
    }
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 600;
      color: #fff;
      overflow: hidden;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      display: block;
    }
    .avatar span {
      font-size: 1.1rem;
      font-weight: 600;
      color: #fff;
    }
    .social-icons {
      display: flex;
      gap: 1.2rem;
      margin-top: 0.2rem;
    }
    .social-icons a {
      color: #fff;
      font-size: 1.4rem;
      transition: color 0.2s;
    }
    .social-icons a:hover {
      color: #222;
    }
    .card-main-content {
      text-align: left;
    }
    .fullname {
      font-size: 1.7rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #fff;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #fff;
    }
    .biography {
      font-size: 1rem;
      margin-bottom: 1rem;
      color: #fff;
      opacity: 1;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .skill-tag {
      background: linear-gradient(90deg, #ff9800 0%, #ff6b00 100%);
      color: #fff;
      padding: 0.3rem 1.2rem;
      border-radius: 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 0.2rem;
      border: none;
      box-shadow: none;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class CardItemComponent {
  @Input() card!: DigitalCard;
  @Input() maxSkills?: number;

  getProfileImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${environment.serverUrl}${imageUrl}`;
  }

  getInitials(fullName: string): string {
    if (!fullName) return '';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getShortBiography(bio: string | undefined): string {
    if (!bio) return '';
    return bio.length > 120 ? bio.slice(0, 120) + '...' : bio;
  }

  formatSkill(skill: string): string {
    if (!skill) return '';
    return skill.toLowerCase();
  }

  getVisibleSkills(skills: string[]): string[] {
    if (this.maxSkills !== undefined) {
      return skills.slice(0, this.maxSkills);
    }
    return skills;
  }

  getSocialIconClass(platform: string): string {
    const p = platform ? platform.toLowerCase() : '';
    if (p.includes('github')) return 'fab fa-github';
    if (p.includes('linkedin')) return 'fab fa-linkedin';
    if (p.includes('twitter')) return 'fab fa-twitter';
    if (p.includes('instagram')) return 'fab fa-instagram';
    if (p.includes('blog')) return 'fas fa-globe';
    if (p.includes('portfolio')) return 'fas fa-briefcase';
    if (p.includes('medium')) return 'fab fa-medium';
    if (p.includes('youtube')) return 'fab fa-youtube';
    if (p.includes('facebook')) return 'fab fa-facebook';
    return 'fas fa-link';
  }

  getSocialKeys(): string[] {
    return Object.keys(this.card.socialLinks || {}).filter(key => !!this.card.socialLinks[key]);
  }
}
