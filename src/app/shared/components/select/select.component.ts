import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { Selectable } from '@shared/models/fieldSet.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent extends AbstractInputComponent {
  @Input() options!: Selectable<any>[];
  @Input() selected!: Selectable<any>;
  @Input() isDirty: boolean = false;
  @Input() dirtyType: 'dirtySelect' | 'dirtyOption' = 'dirtySelect';
  @Output() selectedChange = new EventEmitter<any>();

  public compareFn(c1: Selectable<any>, c2: Selectable<any>): boolean {
    return c1 && c2 ? c1.value === c2.value : c1 === c2;
  }
}
