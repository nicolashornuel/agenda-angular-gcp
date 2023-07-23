import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { FieldSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-table-checkbox',
  templateUrl: './table-checkbox.component.html',
  styleUrls: ['./table-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableCheckboxComponent),
      multi: true
    }
  ]
})
export class TableCheckboxComponent extends AbstractInputComponent {
  @Input() data!: FieldSet;

  constructor() {
    super();
  }

}