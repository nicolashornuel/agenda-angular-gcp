import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileStorage } from '@core/services/firebasestorage.service';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';

export interface Nameable {
  name: string;
}

export interface FieldSet extends Nameable {
  key?: string;
  value?: string | boolean | number | FileStorage | any | Selectable<any>;
  disabled?: boolean;
  required?: boolean;
  parentForm?: NgForm | any;
}

export class FieldSet {
  constructor(fieldSet: FieldSet, value?: any) {
    (this.key = fieldSet.key), 
    (this.name = fieldSet.name),
    this.value = value
  }
}

export class DataField extends FieldSet {
  constructor(fieldSet: FieldSet) {
    super(fieldSet);
  }
}

export class DataFile extends FieldSet {
  constructor(fieldSet: FieldSet) {
    super(fieldSet);
  }
}

export class DataList extends FieldSet {
  options: Set<string>;
  constructor(fieldSet: FieldSet, options: Set<string>) {
    super(fieldSet);
    this.options = options;
  }
}

export class DataSelect<T extends Nameable> extends FieldSet {
  options: Selectable<T>[];
  constructor(fieldSet: FieldSet, options: Selectable<T>[]) {
    super(fieldSet);
    this.options = options;
  }
}

export interface FieldComponent {
  data: FieldSet;
  output: EventEmitter<FieldSet>;
  onSave: (value: string | number | boolean) => void;
}

export interface Selectable<T> extends Nameable {
  value?: T;
}
