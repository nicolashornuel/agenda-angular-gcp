import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, forwardRef, QueryList, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';

@Component({
  selector: 'app-input-star',
  templateUrl: './input-star.component.html',
  styleUrls: ['./input-star.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputStarComponent),
        multi: true
      }
    ]
})
export class InputStarComponent extends AbstractInputComponent implements AfterViewChecked {
  @ViewChildren('star') starList!: QueryList<ElementRef>;

  constructor(private cdRef: ChangeDetectorRef) {
    super();
  }
  
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  onClick(rating: number): void {
    this.value = this.value == 1 && rating == 1 ? 0 : rating;
    this.onBlur.next();
  }

  onPreview(rating: number): void {
    for (let i = 0; i < rating; i++) {
      this.starList.get(i)?.nativeElement.classList.toggle('hover');
    }
  }

  showIcon(index: number): string {
    return (this.value as number) >= index + 1 ? 'fa-solid fa-star' : 'fa-regular fa-star';
  }
}
