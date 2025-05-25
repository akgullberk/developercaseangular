import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoginRequest } from '../../domain/models/login-request.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { StorageService } from '../../../../core/services/storage.service';
import { environment } from '../../../../../environments/environment.prod';

// /api zaten environment.apiUrl içinde olduğu için tekrar eklemiyoruz
const AUTH_URL = `${environment.apiUrl}/auth`;
const USERS_URL = `${environment.apiUrl}/users`;

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
  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  login(loginRequest: LoginRequest): Observable<any> {
    console.log('Login isteği gönderiliyor:', loginRequest);
    return this.http.post(`${AUTH_URL}/login`, loginRequest)
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

    return this.http.post(`${AUTH_URL}/register`, registerRequest, { headers })
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

    return this.http.get<UserProfile>(`${USERS_URL}/profile`, { headers });
  }

  updateUserProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    const token = this.storage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<UserProfile>(`${USERS_URL}/profile`, profileData, { headers });
  }
}
