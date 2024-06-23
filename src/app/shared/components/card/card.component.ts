import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string = '';
  @Input() backgroundColor: string = 'hsl(0, 0%, 100%)';
  @Input() isMiniCard: boolean = false;

}
