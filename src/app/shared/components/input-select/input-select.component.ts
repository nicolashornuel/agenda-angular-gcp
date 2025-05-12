import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { DataSelect, Selectable } from '@shared/models/fieldSet.model';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true
    }
  ]
})
export class InputSelectComponent<T> extends AbstractInputComponent {
  @Input() dataSelect?: DataSelect<T>;
  @Input() isDirty: boolean = false;
  @Output() selectedChange = new EventEmitter<Selectable<T>>();

  public compareFn(c1: Selectable<T>, c2: Selectable<T>): boolean {
    return c1 && c2 ? c1.value === c2.value : c1 === c2;
  }
}
