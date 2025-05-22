import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  uploadProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload/profile-photo`, formData, {
      headers: this.getHeaders()
    }).pipe(
      map((response: any) => {
        // Backend'den gelen dosya yolunu tam URL'ye çeviriyoruz
        if (response && response.fileUrl) {
          // /uploads/... yolunu /api/uploads/... olarak düzeltiyoruz
          const fileUrl = response.fileUrl.replace('/uploads/', '/api/uploads/');
          response.fileUrl = `${environment.serverUrl}${fileUrl}`;
        }
        return response;
      })
    );
  }

  deleteProfilePhoto(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/profile-photo`, {
      headers: this.getHeaders()
    });
  }
} 