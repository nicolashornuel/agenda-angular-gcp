import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FieldComponent, FieldSet} from '@shared/models/tableSet.interface';
import {Subject, debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() type!: string;
  @Input() data!: FieldSet;
  @Input() cssClass!: string;
  @Output() onSave = new EventEmitter<any>();
  private debouncer: Subject<string | number | boolean> = new Subject<string | number | boolean>();

  constructor() {
    this.debouncer.pipe(debounceTime(500), distinctUntilChanged()).subscribe(value => this.onSave.emit(value));
  }

  save(value: string | number | boolean): void {
    this.debouncer.next(value);
  }
}

@Component({
  selector: 'app-input-text',
  template: `<app-input [type]="'text'" [cssClass]="cssClass" [data]="data" (onSave)="onSave($event)"></app-input>`
})
export class InputTextComponent extends FieldComponent {
  //cssClass = 'form-control form-control-sm border border-primary w-100';
  cssClass = 'comment-form-control w-100';

  constructor() {
    super();
  }
}

@Component({
  selector: 'app-input-checkbox',
  template: `<app-input [type]="'checkbox'" [cssClass]="cssClass" [data]="data" (onSave)="onSave($event)"></app-input>`
})
export class InputCheckboxComponent {
  @Input() data!: FieldSet;
  @Output() output = new Subject<FieldSet>();
  cssClass = '';
  constructor() {}

  public onSave(value: string | number | boolean): void {
    const fieldSet = {
      name: this.data.name,
      value,
      disabled: this.data.disabled
    }
      this.output.next(fieldSet);
      this.data = fieldSet;

  }
}
