import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

export interface TableSet {
  title: string;
  verticaltextHeader: boolean;
  hover: boolean;
  maxiHeight?: string;
  height?: string;
  columnSet: ColumnSet[];
  data: any[];
  actions?: {
    save: (row: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  openDetailByClickRow?: (row: any) => string | void;
}

export interface ColumnSet {
  key: string;
  title: string;
  type: 'custom' | 'string' | 'html';
  visible: boolean;
  width?: string;
  innerHTML?: (row: any, col: ColumnSet) => string;
  render?: {
    component: any;
    valuePrepare: (row: any, col: ColumnSet) => FieldSet | any;
    valueSave?: (row: any) => any;
  };
}

export interface FieldSet {
  name: string;
  value: string | boolean | number;
  disabled: boolean;
  required: boolean;
  parentForm?: NgForm;
}

export interface FieldComponent {
  data: FieldSet;
  output: EventEmitter<FieldSet>;
  onSave: (value: string | number | boolean) => void;
}

export class RenderFieldSet {
  public static valuePrepare(row: any, col: ColumnSet): FieldSet {
    return {
      name: col.key,
      value: row[col.key],
      disabled: true,
      required: true
    };
  }
}
