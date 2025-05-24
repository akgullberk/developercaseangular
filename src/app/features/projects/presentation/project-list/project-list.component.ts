import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProjectService, ProjectDTO } from '../../data/services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
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

  deleteProject(projectId: number): void {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (error) => {
          console.error('Proje silinirken hata oluştu:', error);
        }
      });
    }
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