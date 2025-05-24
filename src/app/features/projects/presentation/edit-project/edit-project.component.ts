import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService, ProjectDTO } from '../../data/services/project.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  projectForm: FormGroup;
  projectId: number = 0;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      technologies: ['', Validators.required],
      githubLink: ['', [Validators.pattern('https://github.com/.*')]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.projectId = +params['id'];
        this.loadProject();
    });
  }

  loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project: ProjectDTO) => {
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
          technologies: project.technologies.join(', '),
          githubLink: project.githubLink
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Proje yüklenirken hata oluştu:', error);
        this.router.navigate(['/my-projects']);
      }
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isSaving = true;
      const formValue = this.projectForm.value;

      const projectData = {
        name: formValue.name,
        description: formValue.description,
        technologies: formValue.technologies.split(',').map((tech: string) => tech.trim()),
        githubLink: formValue.githubLink
      };

      this.projectService.updateProject(this.projectId, projectData).subscribe({
        next: () => {
          this.router.navigate(['/my-projects']);
        },
        error: (error) => {
          console.error('Proje güncellenirken hata oluştu:', error);
          let errorMessage = error.message || 'Proje güncellenirken bir hata oluştu';
          
          if (!navigator.onLine) {
            errorMessage = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin';
          }
          
          alert(errorMessage);
          this.isSaving = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/my-projects']);
  }

  onTechnologyInput(event: any): void {
    const input = event.target as HTMLInputElement;
    const technologies = input.value.split(',');
    
    // Her bir teknoloji için maksimum 11 karakter kontrolü
    const validTechnologies = technologies.map(tech => tech.trim()).filter(tech => tech.length <= 11);
    
    // Geçerli teknolojileri birleştirip forma set et
    input.value = validTechnologies.join(', ');
    this.projectForm.get('technologies')?.setValue(input.value);
  }
} 