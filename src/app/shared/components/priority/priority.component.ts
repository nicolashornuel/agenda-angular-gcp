import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss']
})
export class PriorityComponent {

  @Input() rating: number = 0;
  @Input() ratingArr: number[] = [0,1,2,3,4];
  @Output() ratingUpdated = new EventEmitter();

  constructor() {
  }

  onClick(rating:number) {    
    this.rating = rating;
    this.ratingUpdated.emit(rating);
  }

  showIcon(index:number) {    
    return this.rating >= index + 1 ? 'fa-solid fa-star' : 'fa-regular fa-star';
  }
}
