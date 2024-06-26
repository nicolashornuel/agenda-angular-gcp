import { Component, EventEmitter, Input, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@shared/abstracts/input.component';

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
  @Input() options!: { name: string; value: any }[];
  @Input() selected!: any;
  @Output() selectedChange = new EventEmitter<any>();
  public selectOpened: boolean = false;
  public optionSelected: string = '';

  public selectOption(option: string): void {
    this.value = option;
    this.selectedChange.emit(option);
  }
}
