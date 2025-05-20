import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DigitalCard } from '../../domain/models/digital-card.model';
import { DigitalCardRepository } from '../repositories/digital-card.repository';

@Injectable({
  providedIn: 'root'
})
export class DigitalCardService {
  constructor(private repository: DigitalCardRepository) {}

  getCards(): Observable<DigitalCard[]> {
    return this.repository.getCards();
  }

  getCardById(id: string): Observable<DigitalCard | undefined> {
    return this.repository.getCardById(id);
  }

  createCard(card: Omit<DigitalCard, 'id'>): Observable<DigitalCard> {
    return this.repository.createCard(card);
  }

  updateCard(id: string, card: Partial<DigitalCard>): Observable<DigitalCard | undefined> {
    return this.repository.updateCard(id, card);
  }

  deleteCard(id: string): Observable<boolean> {
    return this.repository.deleteCard(id);
  }
} 