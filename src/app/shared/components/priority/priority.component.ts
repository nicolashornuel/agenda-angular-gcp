import { AfterViewInit, ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { FieldSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PriorityComponent),
      multi: true
    }
  ]
})
export class PriorityComponent extends AbstractInputComponent implements AfterViewInit {

  @Input() data!: FieldSet;
  public ratingArr: number[] = [0,1,2];

  constructor(private cdRef:ChangeDetectorRef) {
    super();
  }
  
  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  onClick(rating:number) {    
    this.data.value = rating;    
    this.onBlur.next()
  }

  showIcon(index:number) {    
    return this.data.value as number >= index + 1 ? 'fa-solid fa-star' : 'fa-regular fa-star';
  }
}
