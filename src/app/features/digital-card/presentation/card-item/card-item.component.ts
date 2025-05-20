import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalCard } from '../../domain/models/digital-card.model';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent {
  @Input() card!: DigitalCard;

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }
}
