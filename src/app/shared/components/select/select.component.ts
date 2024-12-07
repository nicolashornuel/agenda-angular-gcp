import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { Nameable } from '@shared/models/tableSet.interface';

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
  ],
  encapsulation: ViewEncapsulation.None
})
export class SelectComponent extends AbstractInputComponent {
  @Input() options!: Selectable<any>[];
  @Input() selected!: Selectable<any>;
  @Output() selectedChange = new EventEmitter<any>();
  public isDirty = false;
}

export interface Selectable<T> extends Nameable {
  isDirty?: boolean;
  value?: T;
  name: string;
}