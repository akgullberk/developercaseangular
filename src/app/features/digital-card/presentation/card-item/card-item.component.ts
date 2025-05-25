import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalCard as BaseDigitalCard } from '../../domain/models/digital-card.model';
import { environment } from '../../../../../environments/environment.prod';

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
          <a *ngFor="let key of getSocialKeys()" [href]="card.socialLinks[key]" target="_blank" [title]="key" (click)="$event.stopPropagation()">
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
      height: auto;
      min-height: 310px;
      max-height: 400px;
      padding: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.2rem;
      width: 100%;
    }
    .avatar {
      width: 56px;
      height: 56px;
      min-width: 56px;
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
      flex-wrap: wrap;
      justify-content: flex-end;
      max-width: 70%;
    }
    .social-icons a {
      color: #fff;
      font-size: 1.4rem;
      transition: color 0.2s;
      min-width: 20px;
      text-align: center;
    }
    .social-icons a:hover {
      color: #222;
    }
    .card-main-content {
      text-align: left;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .fullname {
      font-size: 1.7rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #fff;
      word-break: break-word;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #fff;
      word-break: break-word;
    }
    .biography {
      font-size: 1rem;
      margin-bottom: 1rem;
      color: #fff;
      opacity: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-shrink: 0;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: auto;
      padding-top: 0.5rem;
    }
    .skill-tag {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 0.3rem 0.8rem;
      border-radius: 1rem;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.3px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      max-width: calc(100% - 0.8rem);
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media screen and (max-width: 480px) {
      .custom-card {
        padding: 1rem;
        min-height: 280px;
      }
      .avatar {
        width: 48px;
        height: 48px;
        min-width: 48px;
      }
      .social-icons {
        gap: 0.8rem;
        max-width: 60%;
      }
      .social-icons a {
        font-size: 1.2rem;
      }
      .fullname {
        font-size: 1.4rem;
      }
      .title {
        font-size: 1rem;
      }
      .biography {
        font-size: 0.9rem;
        -webkit-line-clamp: 2;
      }
      .skill-tag {
        padding: 0.25rem 0.6rem;
        font-size: 0.8rem;
        max-width: calc(100% - 0.6rem);
      }
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
