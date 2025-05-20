import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/data/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <!-- Profil Başlık Bölümü -->
      <div class="profile-header">
        <div class="profile-cover">
          <div class="cover-overlay"></div>
          <button class="edit-cover-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/>
              <path d="M12 10v4M10 12h4"/>
            </svg>
            Kapak Fotoğrafı Değiştir
          </button>
        </div>
        
        <div class="profile-info">
          <div class="profile-avatar">
            <img [src]="profileImage || 'assets/images/default-avatar.png'" alt="Profil Fotoğrafı">
            <button class="edit-avatar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          </div>
          
          <div class="profile-details">
            <h1>{{ userProfile?.fullName || 'Ad Soyad' }}</h1>
            <p class="title">{{ userProfile?.title || 'Ünvan' }}</p>
            <p class="location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ userProfile?.location || 'Konum' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Profil İçerik Bölümü -->
      <div class="profile-content">
        <div class="profile-sidebar">
          <div class="profile-card">
            <h3>Hakkımda</h3>
            <p>{{ userProfile?.bio || 'Henüz bir biyografi eklenmemiş.' }}</p>
            <button class="edit-btn">Düzenle</button>
          </div>

          <div class="profile-card">
            <h3>İletişim Bilgileri</h3>
            <ul class="contact-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {{ userProfile?.email || 'E-posta ekle' }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ userProfile?.phone || 'Telefon ekle' }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
                </svg>
                {{ userProfile?.website || 'Website ekle' }}
              </li>
            </ul>
            <button class="edit-btn">Düzenle</button>
          </div>

          <div class="profile-card">
            <h3>Sosyal Medya</h3>
            <ul class="social-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {{ userProfile?.github || 'Github ekle' }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                {{ userProfile?.linkedin || 'LinkedIn ekle' }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                {{ userProfile?.twitter || 'Twitter ekle' }}
              </li>
            </ul>
            <button class="edit-btn">Düzenle</button>
          </div>
        </div>

        <div class="profile-main">
          <div class="profile-card">
            <h3>Yetenekler</h3>
            <div class="skills-grid">
              <span class="skill-tag" *ngFor="let skill of userProfile?.skills">{{ skill }}</span>
              <button class="add-skill-btn">+</button>
            </div>
          </div>

          <div class="profile-card">
            <h3>Deneyim</h3>
            <div class="timeline">
              <div class="timeline-item" *ngFor="let experience of userProfile?.experiences">
                <div class="timeline-date">{{ experience.date }}</div>
                <div class="timeline-content">
                  <h4>{{ experience.title }}</h4>
                  <p class="company">{{ experience.company }}</p>
                  <p class="description">{{ experience.description }}</p>
                </div>
              </div>
              <button class="add-experience-btn">Deneyim Ekle</button>
            </div>
          </div>

          <div class="profile-card">
            <h3>Eğitim</h3>
            <div class="timeline">
              <div class="timeline-item" *ngFor="let education of userProfile?.education">
                <div class="timeline-date">{{ education.date }}</div>
                <div class="timeline-content">
                  <h4>{{ education.degree }}</h4>
                  <p class="school">{{ education.school }}</p>
                  <p class="field">{{ education.field }}</p>
                </div>
              </div>
              <button class="add-education-btn">Eğitim Ekle</button>
            </div>
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
    }

    .profile-header {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .profile-cover {
      height: 200px;
      background: linear-gradient(135deg, #FF6B00, #FF8533);
      position: relative;

      .cover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.2);
      }

      .edit-cover-btn {
        position: absolute;
        right: 1rem;
        bottom: 1rem;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: white;
          transform: translateY(-2px);
        }
      }
    }

    .profile-info {
      padding: 0 2rem 2rem;
      position: relative;
      margin-top: -60px;

      .profile-avatar {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid white;
        overflow: hidden;
        margin-bottom: 1rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .edit-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #FF6B00;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;

          svg {
            stroke: white;
          }

          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .profile-details {
        h1 {
          font-size: 1.8rem;
          color: #2D3748;
          margin-bottom: 0.5rem;
        }

        .title {
          color: #718096;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #718096;

          svg {
            stroke: #FF6B00;
          }
        }
      }
    }

    .profile-content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
    }

    .profile-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;

      h3 {
        color: #2D3748;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }

      .edit-btn {
        width: 100%;
        padding: 0.7rem;
        background: transparent;
        border: 2px solid #FF6B00;
        color: #FF6B00;
        border-radius: 0.5rem;
        margin-top: 1rem;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: rgba(255, 107, 0, 0.1);
        }
      }
    }

    .contact-list, .social-list {
      list-style: none;
      padding: 0;

      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.8rem;
        color: #4A5568;

        svg {
          color: #FF6B00;
        }
      }
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .skill-tag {
        background: rgba(255, 107, 0, 0.1);
        color: #FF6B00;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.9rem;
      }

      .add-skill-btn {
        background: transparent;
        border: 2px dashed #FF6B00;
        color: #FF6B00;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: rgba(255, 107, 0, 0.1);
        }
      }
    }

    .timeline {
      .timeline-item {
        position: relative;
        padding-left: 2rem;
        margin-bottom: 1.5rem;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #E2E8F0;
        }

        &::after {
          content: '';
          position: absolute;
          left: -4px;
          top: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #FF6B00;
        }

        .timeline-date {
          color: #718096;
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
        }

        .timeline-content {
          h4 {
            color: #2D3748;
            margin-bottom: 0.3rem;
          }

          .company, .school {
            color: #4A5568;
            font-weight: 500;
          }

          .description, .field {
            color: #718096;
            font-size: 0.9rem;
            margin-top: 0.3rem;
          }
        }
      }

      .add-experience-btn, .add-education-btn {
        width: 100%;
        padding: 0.7rem;
        background: transparent;
        border: 2px dashed #FF6B00;
        color: #FF6B00;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: rgba(255, 107, 0, 0.1);
        }
      }
    }

    @media (max-width: 768px) {
      .profile-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileImage: string = '';
  userProfile: any = {
    fullName: 'Ahmet Yılmaz',
    title: 'Senior Frontend Developer',
    location: 'İstanbul, Türkiye',
    bio: 'Frontend geliştirici olarak modern web teknolojileri ile çalışmaktan keyif alıyorum.',
    email: 'ahmet@example.com',
    phone: '+90 555 123 4567',
    website: 'www.ahmetyilmaz.com',
    github: 'github.com/ahmetyilmaz',
    linkedin: 'linkedin.com/in/ahmetyilmaz',
    twitter: 'twitter.com/ahmetyilmaz',
    skills: ['Angular', 'React', 'TypeScript', 'SCSS', 'Node.js'],
    experiences: [
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Company',
        date: '2020 - Şimdi',
        description: 'Modern web uygulamaları geliştirme ve ekip liderliği.'
      }
    ],
    education: [
      {
        degree: 'Bilgisayar Mühendisliği',
        school: 'Örnek Üniversitesi',
        field: 'Yazılım Mühendisliği',
        date: '2015 - 2019'
      }
    ]
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Profil bilgilerini API'den al
  }
} 