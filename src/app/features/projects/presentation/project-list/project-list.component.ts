import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProjectService, ProjectDTO } from '../../data/services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="projects-container">
      <div class="projects-header">
        <h1>Projelerim</h1>
        <p>Tüm projelerimi buradan inceleyebilirsiniz</p>
      </div>

      <div class="projects-grid">
        <!-- Proje Ekle Kartı -->
        <div class="project-card add-project" routerLink="/create-project">
          <div class="add-project-content">
            <i class="fas fa-plus"></i>
            <h4>Yeni Proje Ekle</h4>
          </div>
        </div>

        <div *ngFor="let project of projects" class="project-card" (click)="viewProject(project.id)">
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
          <div class="project-actions" (click)="$event.stopPropagation()">
            <a *ngIf="project.githubLink" [href]="project.githubLink" target="_blank" class="github-link">
              <i class="fab fa-github"></i>
              GitHub
            </a>
            <a class="edit-button" (click)="editProject(project.id)">
              <i class="fas fa-edit"></i>
              Düzenle
            </a>
            <button class="project-link" (click)="viewProject(project.id)">
              <i class="fas fa-external-link-alt"></i>
              Projeyi İncele
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .projects-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        color: #2D3748;
        margin-bottom: 0.5rem;
      }

      p {
        color: #718096;
        font-size: 1.1rem;
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
      cursor: pointer;

      &:not(.add-project):hover {
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

    .project-link, .github-link, .edit-button {
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

    .edit-button {
      color: #4A5568;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      transition: all 0.2s;
      background-color: #EDF2F7;

      &:hover {
        color: #2D3748;
        background-color: #E2E8F0;
      }

      i {
        font-size: 0.875rem;
      }
    }

    .add-project {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #F7FAFC;
      border: 2px dashed #E2E8F0;

      &:hover {
        background: #EDF2F7;
        border-color: #CBD5E0;
      }

      .add-project-content {
        text-align: center;
        color: #718096;

        i {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        h4 {
          margin: 0;
          font-size: 1.25rem;
        }
      }
    }

    @media (max-width: 768px) {
      .projects-container {
        padding: 1rem;
      }

      .projects-header {
        margin-bottom: 2rem;

        h1 {
          font-size: 2rem;
        }
      }
    }
  `]
})
export class ProjectListComponent implements OnInit {
  projects: ProjectDTO[] = [];

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  editProject(projectId: number): void {
    console.log('Düzenleme butonuna tıklandı, Project ID:', projectId);
    this.router.navigate(['/edit-project', projectId]);
  }

  viewProject(projectId: number): void {
    this.router.navigate(['/project', projectId]);
  }

  loadProjects(): void {
    this.projectService.getUserProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        console.log('Yüklenen projeler:', projects);
      },
      error: (error) => {
        console.error('Projeler yüklenirken hata oluştu:', error);
      }
    });
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
} 