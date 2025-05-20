import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginRequest } from '../../domain/models/login-request.model';
import { RegisterRequest } from '../../domain/models/register-request.model';
import { StorageService } from '../../../../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8081/api/auth';

  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService
  ) {}

  login(loginRequest: LoginRequest): Observable<any> {
    console.log('Login isteği gönderiliyor:', loginRequest);
    return this.http.post(`${this.API_URL}/login`, loginRequest)
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

    return this.http.post(`${this.API_URL}/register`, registerRequest, { headers })
      .pipe(
        map((response: any) => {
          console.log('Kayıt yanıtı:', response);
          // Eğer backend boş response dönüyorsa, başarılı bir yanıt oluşturalım
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
} 