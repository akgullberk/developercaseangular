import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../data/services/project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-project-container">
      <div class="form-header">
        <h1>Yeni Proje Ekle</h1>
        <p>Projenizin detaylarını aşağıdaki forma girebilirsiniz</p>
      </div>

      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="project-form">
        <div class="form-group">
          <label for="name">Proje Adı</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            placeholder="Projenizin adını girin"
          >
          <div class="error-message" *ngIf="projectForm.get('name')?.errors?.['required'] && projectForm.get('name')?.touched">
            Proje adı zorunludur
          </div>
        </div>

        <div class="form-group">
          <label for="description">Proje Açıklaması</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            placeholder="Projenizi kısaca açıklayın"
          ></textarea>
          <div class="error-message" *ngIf="projectForm.get('description')?.errors?.['required'] && projectForm.get('description')?.touched">
            Proje açıklaması zorunludur
          </div>
        </div>

        <div class="form-group">
          <label for="technologies">Teknolojiler</label>
          <input
            type="text"
            id="technologies"
            formControlName="technologies"
            placeholder="Teknolojileri virgülle ayırarak girin (max 11 karakter)"
            (input)="onTechnologyInput($event)"
          >
          <div class="helper-text">
            Her bir teknoloji ismi maksimum 11 karakter olmalıdır.
          </div>
          <div class="error-message" *ngIf="projectForm.get('technologies')?.errors?.['required'] && projectForm.get('technologies')?.touched">
            En az bir teknoloji girmelisiniz
          </div>
        </div>

        <div class="form-group">
          <label for="githubLink">GitHub Linki</label>
          <input
            type="url"
            id="githubLink"
            formControlName="githubLink"
            placeholder="https://github.com/kullanici/proje"
          >
          <div class="error-message" *ngIf="projectForm.get('githubLink')?.errors?.['pattern']">
            Geçerli bir GitHub linki giriniz
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" (click)="goBack()">İptal</button>
          <button type="submit" class="submit-button" [disabled]="projectForm.invalid || isLoading">
            {{ isLoading ? 'Kaydediliyor...' : 'Projeyi Kaydet' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .create-project-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: #2D3748;
        margin-bottom: 0.5rem;
      }

      p {
        color: #718096;
        font-size: 1.1rem;
      }
    }

    .project-form {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
      }

      textarea {
        resize: vertical;
        min-height: 100px;
      }
    }

    .error-message {
      color: #E53E3E;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;

      button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }
    }

    .cancel-button {
      background: #EDF2F7;
      color: #4A5568;
      border: none;

      &:hover {
        background: #E2E8F0;
      }
    }

    .submit-button {
      background: #FF6B00;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background: #E65C00;
      }
    }

    .helper-text {
      font-size: 0.875rem;
      color: #718096;
      margin-top: 0.25rem;
    }

    @media (max-width: 768px) {
      .create-project-container {
        padding: 1rem;
      }

      .project-form {
        padding: 1.5rem;
      }
    }
  `]
})
export class CreateProjectComponent {
  projectForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      technologies: ['', [Validators.required]],
      githubLink: ['', [Validators.pattern('^https://github.com/.*')]]
    });
  }

  onTechnologyInput(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Virgülle ayrılmış teknolojileri diziye çeviriyoruz
    const technologies = value.split(',');
    
    // Son girilen teknoloji ismini alıyoruz
    const lastTechnology = technologies[technologies.length - 1].trim();
    
    // Eğer son teknoloji 11 karakterden uzunsa, son karakteri siliyoruz
    if (lastTechnology.length > 11) {
      technologies[technologies.length - 1] = lastTechnology.substring(0, 11);
      input.value = technologies.join(',');
      
      // Form kontrolünü güncelliyoruz
      this.projectForm.patchValue({
        technologies: input.value
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading = true;
      const formData = this.projectForm.value;
      
      const technologies = formData.technologies
        .split(',')
        .map((tech: string) => tech.trim())
        .filter((tech: string) => tech.length > 0);

      // Teknoloji isimlerinin uzunluk kontrolü
      const invalidTechnologies: string[] = technologies.filter((tech: string) => tech.length > 11);
      if (invalidTechnologies.length > 0) {
        alert(`Aşağıdaki teknoloji isimleri 11 karakterden uzun:\n${invalidTechnologies.join('\n')}`);
        this.isLoading = false;
        return;
      }

      const projectData = {
        name: formData.name,
        description: formData.description,
        technologies: technologies,
        githubLink: formData.githubLink
      };

      this.projectService.createProject(projectData).subscribe({
        next: () => {
          this.router.navigate(['/my-projects']);
        },
        error: (error) => {
          console.error('Proje oluşturulurken hata:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/my-projects']);
  }
} 