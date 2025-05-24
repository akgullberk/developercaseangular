import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../../../core/services/storage.service';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';

const API_URL = 'http://16.170.205.160:8081/api';

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
  private readonly DIGITAL_CARDS_URL = `${API_URL}/digital-cards`;

  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.storage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private fixProfilePhotoUrl(card: any): any {
    if (card && card.profilePhotoUrl && card.profilePhotoUrl.includes('localhost:8081')) {
      card.profilePhotoUrl = card.profilePhotoUrl.replace('http://localhost:8081', environment.serverUrl);
    }
    return card;
  }

  getCards(): Observable<DigitalCardResponse[]> {
    return this.http.get<DigitalCardResponse[]>(
      `${this.DIGITAL_CARDS_URL}/my-cards`,
      { headers: this.getHeaders() }
    ).pipe(
      map(cards => cards.map(card => this.fixProfilePhotoUrl(card)))
    );
  }

  createDigitalCard(cardData: DigitalCardRequest): Observable<DigitalCardResponse> {
    return this.http.post<DigitalCardResponse>(
      this.DIGITAL_CARDS_URL,
      cardData,
      { headers: this.getHeaders() }
    ).pipe(
      map(card => this.fixProfilePhotoUrl(card))
    );
  }

  getDigitalCard(username: string): Observable<DigitalCardResponse> {
    return this.http.get<DigitalCardResponse>(
      `${this.DIGITAL_CARDS_URL}/${username}`
    ).pipe(
      map(card => this.fixProfilePhotoUrl(card))
    );
  }

  updateDigitalCard(cardData: DigitalCardRequest): Observable<DigitalCardResponse> {
    return this.http.put<DigitalCardResponse>(
      this.DIGITAL_CARDS_URL,
      cardData,
      { headers: this.getHeaders() }
    ).pipe(
      map(card => this.fixProfilePhotoUrl(card))
    );
  }

  deleteDigitalCard(): Observable<void> {
    return this.http.delete<void>(
      this.DIGITAL_CARDS_URL,
      { headers: this.getHeaders() }
    );
  }

  getAllDigitalCards(): Observable<DigitalCardResponse[]> {
    return this.http.get<DigitalCardResponse[]>(`${this.DIGITAL_CARDS_URL}/all`).pipe(
      map(cards => cards.map(card => this.fixProfilePhotoUrl(card)))
    );
  }

  getCardWithProjects(username: string): Observable<CardWithProjectsDTO> {
    return this.http.get<CardWithProjectsDTO>(`${this.DIGITAL_CARDS_URL}/${username}/with-projects`).pipe(
      map(response => {
        if (response.digitalCard) {
          response.digitalCard = this.fixProfilePhotoUrl(response.digitalCard);
        }
        return response;
      })
    );
  }
} 