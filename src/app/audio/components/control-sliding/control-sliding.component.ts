import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-control-sliding',
  templateUrl: './control-sliding.component.html',
  styleUrls: ['./control-sliding.component.scss']
})
export class ControlSlidingComponent {

  @Input() name?: string;
  @Input() value!: number;
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
