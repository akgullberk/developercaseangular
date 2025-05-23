import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface ProjectDTO {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  githubLink: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getUserProjects(): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(`${this.apiUrl}/user`).pipe(
      catchError(this.handleError)
    );
  }

  getProjectById(id: number): Observable<ProjectDTO> {
    return this.http.get<ProjectDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProject(project: Omit<ProjectDTO, 'id'>): Observable<ProjectDTO> {
    return this.http.post<ProjectDTO>(this.apiUrl, project).pipe(
      catchError(this.handleError)
    );
  }

  updateProject(id: number, project: Omit<ProjectDTO, 'id'>): Observable<ProjectDTO> {
    return this.http.put<ProjectDTO>(`${this.apiUrl}/${id}`, project).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Bir hata oluştu';
    
    if (error.status === 403) {
      errorMessage = 'Bu işlem için yetkiniz bulunmamaktadır. Lütfen giriş yapın.';
    } else if (error.status === 404) {
      errorMessage = 'Proje bulunamadı.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Hata: ${error.error.message}`;
    } else {
      errorMessage = `Backend hatası: ${error.status}\nMesaj: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 