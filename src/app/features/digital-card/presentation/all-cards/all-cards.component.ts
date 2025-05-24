import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DigitalCardService, DigitalCardResponse } from '../../data/services/digital-card.service';
import { DigitalCard } from '../../domain/models/digital-card.model';
import { CardItemComponent } from '../card-item/card-item.component';

@Component({
  selector: 'app-all-cards',
  standalone: true,
  imports: [CommonModule, RouterModule, CardItemComponent],
  templateUrl: './all-cards.component.html',
  styleUrls: ['./all-cards.component.scss']
})
export class AllCardsComponent implements OnInit {
  cards: DigitalCardResponse[] = [];

  constructor(
    private digitalCardService: DigitalCardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllCards();
  }

  loadAllCards(): void {
    this.digitalCardService.getAllDigitalCards().subscribe({
      next: (cards) => {
        this.cards = cards;
      },
      error: (error) => {
        console.error('Kartlar yüklenirken hata oluştu:', error);
      }
    });
  }

  viewCard(username: string): void {
    this.router.navigate(['/card', username]);
  }

  transformToCardItem(card: DigitalCardResponse): DigitalCard {
    const socialLinks: { [key: string]: string } = {
      ['github']: '',
      ['linkedin']: '',
      ['twitter']: '',
      ['instagram']: ''
    };

    if (card.socialMediaLinks && Array.isArray(card.socialMediaLinks)) {
      card.socialMediaLinks.forEach(link => {
        if (link.platform && link.url) {
          const platform = link.platform.toLowerCase();
          if (platform.includes('github')) socialLinks['github'] = link.url;
          if (platform.includes('linkedin')) socialLinks['linkedin'] = link.url;
          if (platform.includes('twitter')) socialLinks['twitter'] = link.url;
          if (platform.includes('instagram')) socialLinks['instagram'] = link.url;
        }
      });
    }

    return {
      id: card.id.toString(),
      fullName: card.fullName,
      profileImage: card.profilePhotoUrl || '',
      title: card.title || '',
      biography: card.biography || '',
      skills: card.skills || [],
      socialLinks: socialLinks
    };
  }
} 