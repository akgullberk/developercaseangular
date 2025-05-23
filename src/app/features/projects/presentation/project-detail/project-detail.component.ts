import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, ProjectDTO } from '../../data/services/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="project-detail-container" *ngIf="project">
      <!-- Hero Section -->
      <div class="project-hero">
        <div class="hero-content">
          <div class="back-button" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
            Projelere Dön
          </div>
          <h1>{{ project.name }}</h1>
        </div>
      </div>

      <div class="content-container">
        <!-- Proje Açıklaması -->
        <div class="description-card">
          <h2>Proje Açıklaması</h2>
          <p class="project-description">{{ project.description }}</p>
        </div>

        <!-- Proje İçeriği -->
        <div class="project-content">
          <!-- Teknolojiler -->
          <section class="section-card">
            <h2>Kullanılan Teknolojiler</h2>
            <div class="tech-stack">
              <div class="tech-item" *ngFor="let tech of project.technologies">
                <i class="fas fa-code"></i>
                <span>{{ tech }}</span>
              </div>
            </div>
          </section>

          <!-- GitHub Bağlantısı -->
          <section class="section-card" *ngIf="project.githubLink">
            <h2>Proje Kaynakları</h2>
            <div class="resources">
              <a [href]="project.githubLink" target="_blank" class="resource-link">
                <i class="fab fa-github"></i>
                <span>GitHub Repository</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div class="loading-container" *ngIf="isLoading">
      <div class="loading-spinner"></div>
      <p>Proje detayları yükleniyor...</p>
    </div>
  `,
  styles: [`
    .project-detail-container {
      min-height: 100vh;
      background: #f8fafc;
      padding-top: 64px; /* Top bar yüksekliği kadar padding */
    }

    .project-hero {
      background: linear-gradient(135deg, #FF6B00, #FF8533);
      padding: 4rem 2rem;
      color: white;
      position: relative;
      margin-top: -64px; /* Top bar yüksekliği kadar negatif margin */
      padding-top: calc(64px + 4rem); /* Top bar yüksekliği + normal padding */
    }

    .back-button {
      position: absolute;
      left: 2rem;
      top: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      i {
        font-size: 1rem;
      }
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;

      h1 {
        font-size: 2.5rem;
        margin: 1rem 0;
      }
    }

    .content-container {
      max-width: 1200px;
      margin: -2rem auto 0;
      padding: 0 2rem;
      position: relative;
    }

    .description-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      h2 {
        color: #2D3748;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #EDF2F7;
      }

      .project-description {
        color: #4A5568;
        font-size: 1.1rem;
        line-height: 1.8;
        margin: 0;
        padding: 1rem;
        background: #F7FAFC;
        border-radius: 0.5rem;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
    }

    .section-card {
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

    .tech-stack {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;

      .tech-item {
        padding: 1.5rem;
        background: #F7FAFC;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        i {
          font-size: 1.5rem;
          color: #FF6B00;
        }

        span {
          color: #2D3748;
          font-size: 1.1rem;
          font-weight: 500;
        }
      }
    }

    .resources {
      display: flex;
      gap: 1rem;

      .resource-link {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        background: #F7FAFC;
        color: #2D3748;
        text-decoration: none;
        border-radius: 0.5rem;
        font-weight: 500;
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
      .project-hero {
        padding: 3rem 1rem;
      }

      .back-button {
        left: 1rem;
        top: 1rem;
      }

      .hero-content {
        h1 {
          font-size: 2rem;
        }
      }

      .content-container {
        padding: 0 1rem;
      }

      .section-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project: ProjectDTO | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadProject(+params['id']);
      }
    });
  }

  loadProject(id: number): void {
    this.isLoading = true;
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Proje detayları yüklenirken hata:', error);
        this.router.navigate(['/my-projects']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/my-projects']);
  }
} 