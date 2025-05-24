import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../data/services/project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  projectForm: FormGroup;
  isLoading = false;
  readonly MAX_PROJECT_NAME_LENGTH = 100;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(this.MAX_PROJECT_NAME_LENGTH)]],
      description: ['', [Validators.required]],
      technologies: ['', [Validators.required]],
      githubLink: ['', [Validators.pattern('^https://github.com/.*')]]
    });
  }

  onProjectNameInput(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > this.MAX_PROJECT_NAME_LENGTH) {
      input.value = input.value.slice(0, this.MAX_PROJECT_NAME_LENGTH);
      this.projectForm.patchValue({
        name: input.value
      });
    }
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

      // Proje adı uzunluk kontrolü
      if (formData.name.length > this.MAX_PROJECT_NAME_LENGTH) {
        alert(`Proje ismi ${this.MAX_PROJECT_NAME_LENGTH} karakterden fazla olamaz.`);
        this.isLoading = false;
        return;
      }
      
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