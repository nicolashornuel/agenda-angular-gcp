import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldComponent, FieldSet } from '@shared/models/tableSet.interface';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements FieldComponent, OnInit {
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
