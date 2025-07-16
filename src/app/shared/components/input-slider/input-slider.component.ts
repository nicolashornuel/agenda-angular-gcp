import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';

@Component({
  selector: 'app-input-slider',
  templateUrl: './input-slider.component.html',
  styleUrls: ['./input-slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSliderComponent),
      multi: true
    }
  ]
})
export class InputSliderComponent extends AbstractInputComponent {

  @Input() name?: string;
  @Output() valueChange = new EventEmitter<number>();
  @Input() max: number = 30;
  @Input() min: number = -30;
  @Input() step: number = 1;
  @Input() format: string = '1.1';


  onIncrease(): void {
    if (Number(this.value) < Number(this.max)) {
      this.value = Number(this.value) + Number(this.step);
      this.valueChange.emit(this.value);
    }
  }

  onDecreases(): void {
    if (Number(this.value.toFixed(1)) > Number(this.min)) {
      this.value = Number(this.value.toFixed(1)) - Number(this.step);
      this.valueChange.emit(Number(this.value.toFixed(1)));
    }
  }
}
