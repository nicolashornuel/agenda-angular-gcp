import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {AbstractInputComponent} from '@shared/abstracts/input.component';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text-with-label.component.html',
  styleUrls: ['./input-text-with-label.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextWithLabelComponent),
      multi: true
    }
  ]
})
export class InputTextWithLabelComponent extends AbstractInputComponent {

}
