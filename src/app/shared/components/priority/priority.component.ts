import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldComponent, FieldSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss']
})
export class PriorityComponent implements AfterViewInit {

  @Input() data!: FieldSet;
  private rating!: number;
  public ratingArr: number[] = [0,1,2];
  @Output() ratingUpdated = new EventEmitter();

  constructor() {}
  
  ngAfterViewInit(): void {
    console.log(this.data); 
    this.rating = this.data.value as number; 
  }

  onClick(rating:number) {    
    this.rating = rating;
    this.ratingUpdated.emit(rating);
  }

  showIcon(index:number) {    
    return this.rating >= index + 1 ? 'fa-solid fa-star' : 'fa-regular fa-star';
  }
}
