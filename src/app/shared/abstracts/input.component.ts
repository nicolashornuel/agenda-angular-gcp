import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractNgModelComponent } from './ng-model.component';

@Component({ template: '' })
export class AbstractInputComponent extends AbstractNgModelComponent<string> {
    @Input()
    readonly: boolean = false;
  
    @Input()
    required: boolean = false;
  
    @Input()
    placeholder: string = '';
  
    @Input()
    type: string = 'text';
  
    @Output()
    onBlur = new EventEmitter<void>();
  
    @Output()
    onFocus = new EventEmitter<void>();
  
    get inputReadonly(): boolean {
      return this.readonly || typeof this.readonly !== 'boolean';
    }
  
    get inputRequired(): boolean {
      return this.required || typeof this.required !== 'boolean';
    }
}
