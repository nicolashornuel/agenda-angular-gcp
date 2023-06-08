import {EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

export interface TableSet {
  title: string;
  verticaltextHeader: boolean;
  hover: boolean;
  maxiHeight?: string;
  height?: string;
  columnSet: ColumnSet[];
  data: any[];
  emptyRow: any;
  openDetailByClickRow?: (row: any) => string;
}

export interface ColumnSet {
  key: string;
  title: string;
  type: 'custom' | 'string';
  visible: boolean;
  width?: string;
  render?: {
    component: any;
    valuePrepare: (row: any, col: ColumnSet) => FieldSet | any;
    valueSave: (value: any) => any;
  };
}

export interface FieldSet {
  name: string;
  value: string | boolean | number;
  disabled: boolean;
}

export interface FieldComponent {
  data: FieldSet;
  output: EventEmitter<FieldSet>;
  onSave: (value: string | number | boolean) => void;
}

/* @Injectable()
export abstract class FieldComponent {
    @Input() data!: FieldSet;
    @Output() output = new Subject<string | number | boolean>();
    constructor() {}
    onSave(value: string | number | boolean): void {
        this.output.next(value);
    }
} */

export class RenderFieldSet {
  public static valuePrepare(row: any, col: ColumnSet): FieldSet {
    return {
      name: col.key,
      value: row[col.key],
      disabled: false
    };
  }
}
