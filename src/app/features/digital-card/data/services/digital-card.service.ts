import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StorageService } from '../../../../core/services/storage.service';
import { environment } from '../../../../../environments/environment.prod';
import { map, catchError, retry } from 'rxjs/operators';

const API_URL = `http://13.48.69.251:8081/api/digital-cards`;

export interface SocialMediaLink {
  platform: string;
  url: string;
  customName?: string;
}

export interface DigitalCardRequest {
  fullName: string;
  profilePhotoUrl?: string;
  title?: string;
  biography?: string;
  socialMediaLinks: SocialMediaLink[];
  skills: string[];
}

export interface DigitalCardResponse {
  id: number;
  fullName: string;
  profilePhotoUrl?: string;
  title?: string;
  biography?: string;
  username: string;
  company?: string;
  email?: string;
  phone?: string;
  socialMediaLinks: SocialMediaLink[];
  skills: string[];
}

export interface DigitalCardDTO {
  id: number;
  fullName: string;
  profilePhotoUrl: string;
  title: string;
  biography: string;
  socialMediaLinks: SocialMediaLink[];
  skills: string[];
  username: string;
}

export interface ProjectDTO {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  githubLink: string;
}

export interface CardWithProjectsDTO {
  digitalCard: DigitalCardDTO;
  projects: ProjectDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class DigitalCardService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.storage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Bir hata oluştu';

    if (error.error instanceof ErrorEvent) {
      // Client-side hata
      errorMessage = `Hata: ${error.error.message}`;
    } else {
      // Server-side hata
      if (error.status === 0) {
        errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
      } else {
        errorMessage = `Sunucu hatası: ${error.status} - ${error.message}`;
      }
    }

    console.error('API Hatası:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private fixProfilePhotoUrl(card: any): any {
    if (card && card.profilePhotoUrl && card.profilePhotoUrl.includes('localhost:8081')) {
      card.profilePhotoUrl = card.profilePhotoUrl.replace('http://localhost:8081', environment.serverUrl);
    }
    return card;
  }

  getCards(): Observable<DigitalCardResponse[]> {
    console.log('Fetching cards from:', `${API_URL}/my-cards`);
    return this.http.get<DigitalCardResponse[]>(
      `${API_URL}/my-cards`,
      {
        headers: this.getHeaders(),
        observe: 'response'
      }
    ).pipe(
      retry(1),
      map(response => {
        console.log('Cards API Response:', response);
        return (response.body || []).map(card => this.fixProfilePhotoUrl(card));
      }),
      catchError(this.handleError)
    );
  }

  createDigitalCard(cardData: DigitalCardRequest): Observable<DigitalCardResponse> {
    return this.http.post<DigitalCardResponse>(
      API_URL,
      cardData,
      { headers: this.getHeaders() }
    ).pipe(
      map(card => this.fixProfilePhotoUrl(card))
    );
  }

  getDigitalCard(username: string): Observable<DigitalCardResponse> {
    return this.http.get<DigitalCardResponse>(
      `${API_URL}/${username}`
    ).pipe(
      map(card => this.fixProfilePhotoUrl(card))
    );
  }

  updateDigitalCard(cardData: DigitalCardRequest): Observable<DigitalCardResponse> {
    return this.http.put<DigitalCardResponse>(
      API_URL,
      cardData,
      { headers: this.getHeaders() }
    ).pipe(
      map(card => this.fixProfilePhotoUrl(card))
    );
  }

  deleteDigitalCard(): Observable<void> {
    return this.http.delete<void>(
      API_URL,
      { headers: this.getHeaders() }
    );
  }

  getAllDigitalCards(): Observable<DigitalCardResponse[]> {
    return this.http.get<DigitalCardResponse[]>(`${API_URL}/all`).pipe(
      retry(1), // Bir kez yeniden deneme
      map(cards => cards.map(card => this.fixProfilePhotoUrl(card))),
      catchError(this.handleError)
    );
  }

  getCardWithProjects(username: string): Observable<CardWithProjectsDTO> {
    return this.http.get<CardWithProjectsDTO>(`${API_URL}/${username}/with-projects`).pipe(
      map(response => {
        if (response.digitalCard) {
          response.digitalCard = this.fixProfilePhotoUrl(response.digitalCard);
        }
        return response;
      })
    );
  }
}
