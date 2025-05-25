import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = `${environment.apiUrl}/api/files`;

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

    // Content-Type header'ı otomatik olarak ayarlanacak
    const headers = this.getHeaders();

    return this.http.post(`${this.baseUrl}/upload/profile-photo`, formData, {
      headers: headers
    }).pipe(
      map((response: any) => {
        console.log('Upload response:', response);
        if (response && response.fileUrl) {
          // /api prefix'ini kaldırıyoruz
          const fileUrl = response.fileUrl.replace('/api/', '/');
          response.fileUrl = `${environment.serverUrl}${fileUrl}`;
          console.log('Modified file URL:', response.fileUrl);
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
