import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';

@Component({
  selector: 'app-input-suggestion',
  templateUrl: './input-suggestion.component.html',
  styleUrls: ['./input-suggestion.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSuggestionComponent),
      multi: true
    }
  ]
})
export class InputSuggestionComponent extends AbstractInputComponent {
  @Input() options!: Set<string>;

}
