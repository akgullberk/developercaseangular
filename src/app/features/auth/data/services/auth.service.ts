import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginRequest } from '../../domain/models/login-request.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { StorageService } from '../../../../core/services/storage.service';
import { environment } from '../../../../../environments/environment';

const API_URL = 'http://16.170.205.160:8081/api';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_URL = `${API_URL}/auth`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  login(loginRequest: LoginRequest): Observable<any> {
    console.log('Login isteği gönderiliyor:', loginRequest);
    return this.http.post(`${this.AUTH_URL}/login`, loginRequest)
      .pipe(
        tap((response: any) => {
          console.log('Login yanıtı:', response);
          if (response.token) {
            this.storage.setItem('token', response.token);
          }
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    console.log('Kayıt isteği gönderiliyor:', registerRequest);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.AUTH_URL}/register`, registerRequest, { headers })
      .pipe(
        map((response: any) => {
          console.log('Kayıt yanıtı:', response);
          return response || { success: true, message: 'Kayıt başarılı' };
        }),
        catchError((error) => {
          console.error('Kayıt servisi hatası:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.storage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.storage.getItem('token');
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }

  getUserProfile(): Observable<UserProfile> {
    const token = this.storage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserProfile>(`${API_URL}/users/profile`, { headers });
  }

  updateUserProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    const token = this.storage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<UserProfile>(`${API_URL}/users/profile`, profileData, { headers });
  }
} 