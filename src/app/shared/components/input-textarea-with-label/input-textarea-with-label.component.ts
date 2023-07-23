import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';

@Component({
  selector: 'app-input-textarea-with-label',
  templateUrl: './input-textarea-with-label.component.html',
  styleUrls: ['./input-textarea-with-label.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextareaWithLabelComponent),
      multi: true
    }
  ]
})
export class InputTextareaWithLabelComponent extends AbstractInputComponent {
  @Input()
  label: string = '';
  @Input()
  rows: string = "3";

  get asterix(): string {
    return this.inputRequired ? ' *' : '';
  }
}
