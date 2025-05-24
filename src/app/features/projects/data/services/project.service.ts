import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { StorageService } from '../../../../core/services/storage.service';

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
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.storage.getItem('token');
    if (!token) {
      console.error('Token bulunamadı!');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUserProjects(): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(`${this.apiUrl}/user`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getProjectById(id: number): Observable<ProjectDTO> {
    return this.http.get<ProjectDTO>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createProject(project: Omit<ProjectDTO, 'id'>): Observable<ProjectDTO> {
    return this.http.post<ProjectDTO>(this.apiUrl, project, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateProject(id: number, project: Omit<ProjectDTO, 'id'>): Observable<ProjectDTO> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Güncelleme isteği gönderiliyor:', { url, project });
    return this.http.put<ProjectDTO>(url, project, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Bir hata oluştu';
    
    if (!navigator.onLine) {
      errorMessage = 'İnternet bağlantınızı kontrol edin';
    } else if (error.status === 0) {
      errorMessage = 'Sunucuya erişilemiyor. Lütfen daha sonra tekrar deneyin.';
    } else if (error.status === 403) {
      errorMessage = 'Bu işlem için yetkiniz bulunmamaktadır. Lütfen giriş yapın.';
      // Oturum sonlandırma işlemi eklenebilir
      this.storage.removeItem('token');
      window.location.href = '/login';
    } else if (error.status === 404) {
      errorMessage = 'Proje bulunamadı.';
      window.location.href = '/my-projects';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `İstemci hatası: ${error.error.message}`;
    } else {
      errorMessage = `Sunucu hatası: ${error.status}\nMesaj: ${error.message}`;
    }
    
    console.error('API Hatası:', {
      status: error.status,
      message: error.message,
      error: error.error
    });
    
    return throwError(() => new Error(errorMessage));
  }
} 