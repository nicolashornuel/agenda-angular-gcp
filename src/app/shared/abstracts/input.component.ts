import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractNgModelComponent } from './ng-model.component';
import { NgForm, NgModel } from '@angular/forms';

@Component({ template: '' })
export class AbstractInputComponent extends AbstractNgModelComponent implements AfterViewInit {
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

    @Input() parentForm?: NgForm;
    @ViewChild(NgModel) ngModel!: NgModel;
    @Output() onModelChange = new EventEmitter<any>();

    ngAfterViewInit(): void {
      if (this.parentForm)
      this.parentForm.addControl(this.ngModel);
    }
}
