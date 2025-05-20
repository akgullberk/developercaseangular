import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DigitalCard } from '../../domain/models/digital-card.model';

@Injectable({
  providedIn: 'root'
})
export class DigitalCardRepository {
  private mockCards: DigitalCard[] = [
    {
      id: '1',
      fullName: 'Ahmet Yılmaz',
      title: 'Senior Frontend Developer',
      profileImage: 'https://avatars.githubusercontent.com/u/1234567',
      biography: 'React ve Angular konusunda 5+ yıl deneyimli, modern web teknolojilerine hakim frontend geliştirici.',
      socialLinks: {
        github: 'https://github.com/ahmetyilmaz',
        linkedin: 'https://linkedin.com/in/ahmetyilmaz',
        twitter: 'https://twitter.com/ahmetyilmaz'
      },
      skills: ['Angular', 'React', 'TypeScript', 'SCSS', 'Node.js']
    },
    {
      id: '2',
      fullName: 'Ayşe Demir',
      title: 'Full Stack Developer',
      profileImage: 'https://avatars.githubusercontent.com/u/7654321',
      biography: 'Full stack web geliştirici olarak modern teknolojilerle çalışmaktan keyif alıyorum.',
      socialLinks: {
        github: 'https://github.com/aysedemir',
        linkedin: 'https://linkedin.com/in/aysedemir'
      },
      skills: ['JavaScript', 'Python', 'Django', 'PostgreSQL', 'Docker']
    }
  ];

  getCards(): Observable<DigitalCard[]> {
    return of(this.mockCards);
  }

  getCardById(id: string): Observable<DigitalCard | undefined> {
    return of(this.mockCards.find(card => card.id === id));
  }

  createCard(card: Omit<DigitalCard, 'id'>): Observable<DigitalCard> {
    const newCard: DigitalCard = {
      ...card,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.mockCards.push(newCard);
    return of(newCard);
  }

  updateCard(id: string, card: Partial<DigitalCard>): Observable<DigitalCard | undefined> {
    const index = this.mockCards.findIndex(c => c.id === id);
    if (index === -1) return of(undefined);

    this.mockCards[index] = { ...this.mockCards[index], ...card };
    return of(this.mockCards[index]);
  }

  deleteCard(id: string): Observable<boolean> {
    const index = this.mockCards.findIndex(c => c.id === id);
    if (index === -1) return of(false);

    this.mockCards.splice(index, 1);
    return of(true);
  }
} 