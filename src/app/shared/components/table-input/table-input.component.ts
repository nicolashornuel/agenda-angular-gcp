import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { FieldComponent, FieldSet } from '@shared/models/fieldSet.model';

@Component({
  selector: 'app-table-input',
  templateUrl: './table-input.component.html',
  styleUrls: ['./table-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableInputComponent),
      multi: true
    }
  ]
})
export class TableInputComponent extends AbstractInputComponent implements FieldComponent {
  @Input() data!: FieldSet;
  @Output() dataChange = new EventEmitter<FieldSet>();
}