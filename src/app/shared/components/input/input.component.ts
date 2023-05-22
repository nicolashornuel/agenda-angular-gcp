import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FieldComponent, FieldSet} from '@shared/models/tableSet.interface';
import {Subject, debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() type: string = 'text';
  @Input() data!: FieldSet;
  @Output() onSave = new EventEmitter<any>();
  private debouncer: Subject<string | number | boolean> = new Subject<string | number | boolean>();

  constructor() {
    this.debouncer.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(value => this.onSave.emit(value));
  }

  save(value: string | number | boolean): void {
    this.debouncer.next(value);
  }
}

@Component({
  template: `<app-input [type]="'text'" [data]="data" (onSave)="onSave($event)"></app-input>`
})
export class InputTextComponent extends FieldComponent {
  constructor() {
    super();
  }
}
