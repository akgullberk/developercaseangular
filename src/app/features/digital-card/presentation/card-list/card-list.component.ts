import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalCard } from '../../domain/models/digital-card.model';
import { DigitalCardService } from '../../data/services/digital-card.service';
import { CardItemComponent } from '../card-item/card-item.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CardItemComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  cards: DigitalCard[] = [];

  constructor(private digitalCardService: DigitalCardService) {}

  ngOnInit(): void {
    this.digitalCardService.getCards().subscribe(cards => {
      this.cards = cards;
    });
  }
}
