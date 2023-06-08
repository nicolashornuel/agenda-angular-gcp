import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  selector: 'app-input-checkbox',
  template: `<app-input [type]="'checkbox'" [data]="data" (onSave)="onSave($event)"></app-input>`
})
export class InputCheckboxComponent implements FieldComponent, OnInit {
  @Input() data!: FieldSet;
  @Output() output = new EventEmitter<FieldSet>();
  private debouncer = new Subject<string | number | boolean>();

  constructor() {}

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(500), distinctUntilChanged()).subscribe(value => {
      const fieldSet = {
        name: this.data.name,
        value,
        disabled: this.data.disabled
      };
      this.data = fieldSet;
      this.output.emit(fieldSet);
    });
  }

  onSave(value: string | number | boolean): void {
    this.debouncer.next(value);
  }
}
