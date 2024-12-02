import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BadgeLinkComponent } from '@shared/components/badge-link/badge-link.component';
import { FileStorage } from '@shared/components/input-file/input-file.component';
import { TableCheckboxComponent } from '@shared/components/table-checkbox/table-checkbox.component';

export interface TableSet {
  title?: string;
  verticaltextHeader: boolean;
  hover: boolean;
  maxiHeight?: string;
  height?: string;
  columnSet: ColumnSet[];
  data: any[];
  actionSet?: ActionSet[];
  actions?: {
    save: (row: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  openDetailByClickRow?: (row: any) => string | void;
}

export interface ActionSet {
  icon: string;
  method: (row: any) => Promise<any> | void;
}

export class ActionSet {
  public static readonly EDIT = "fas fa-pencil-alt";
  public static readonly DELETE = "fas fa-trash-alt";
  public static readonly CANCEL = "fas fa-times";
  public static readonly SAVE = "fas fa-save";
  constructor(icon: string, method: (row: any) => Promise<any> | void) {
    this.icon = icon;
    this.method = method;
  }
}

export interface ColumnSet {
  key: string;
  title: string;
  type: 'custom' | 'string' | 'html' | 'date';
  visible: boolean;
  width?: string;
  innerHTML?: (row: any, col: ColumnSet) => string;
  render?: {
    component: any;
    valuePrepare: (row: any, col: ColumnSet) => FieldSet | any;
    valueSave?: (row: any) => any;
  };
}
interface Nameable {
  key: string;
  title: string;
}
interface DataColumn<T extends 'string' | 'custom' | 'html' | 'date'> {
  key: string;
  title: string;
  type: T;
  visible: boolean;
  width: string | undefined;
}
class DataColumn<T> implements DataColumn<T> {
  constructor(name: Nameable, visible: boolean, type: T) {
    (this.key = name.key), (this.title = name.title), (this.visible = visible)
    , this.type = type;
  }
}

export class ColumnHtml extends DataColumn<'html'> {
  innerHTML: ((row: any, col: any) => string) | undefined;
  constructor(name: Nameable, visible: boolean, innerHTML?: (row: any, col: any) => string) {
    super(name, visible, 'html');
    this.innerHTML = innerHTML;
  }
}
export class ColumnString extends DataColumn<'string'> {
  constructor(name: Nameable, visible: boolean) {
    super(name, visible, 'string');
  }
}
export class ColumnCustom extends DataColumn<'custom'> {
  render:
    | { component: any; valuePrepare: (row: any, col: ColumnSet) => any; valueSave?: ((row: any) => any) | undefined }
    | undefined;
  constructor(
    name: Nameable,
    visible: boolean,
    render:
      | { component: any; valuePrepare: (row: any, col: ColumnSet) => any; valueSave?: (row: any) => any }
      | undefined
  ) {
    super(name, visible, 'custom');
    this.render = render;
  }
}

export interface FieldSet {
  name: string;
  value?: string | boolean | number | FileStorage;
  disabled?: boolean;
  required?: boolean;
  parentForm?: NgForm;
  options?: any;
}

export class FieldSet {
  constructor(name: string, value: string | boolean | number, disabled: boolean = false, required: boolean = false) {
    (this.name = name), (this.value = value), (this.disabled = disabled), (this.required = required);
  }
}
export class DataField extends FieldSet {
  constructor(data: {key: string, title: string}, object: any) {
    super(data.title, object ? object[data.key] : "")
  }
}
export class DataSelect<T> {
  name: string;
  value: T;
  disabled?: boolean;
  required?: boolean;
  parentForm?: NgForm;
  options: { name: string; value: any }[];
  constructor(data: {key: string, title: string}, object: any, options: { name: string; value: any }[]) {
    this.name = data.title
    this.options = options
    this.value = object[data.key];
  }
}

export interface FieldComponent {
  data: FieldSet;
  output: EventEmitter<FieldSet>;
  onSave: (value: string | number | boolean) => void;
}

export class CellRenderers {
  public static toField(row: any, col: ColumnSet, disabled?: boolean): FieldSet {
    return {
      name: col.key,
      value: row[col.key],
      disabled: disabled ?? true,
      required: true
    };
  }

  public static toDate(row: any, col: ColumnSet): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    const date: Date = new Date(row[col.key]);
    return `<div class="txt-nowrap">${date.toLocaleDateString('fr-FR', options)}</div>`;
  }

  public static toShortDate() {
    return (row: any, col: ColumnSet) => CellRenderers.toDate(row, col);
  }

  public static toCheckBox() {
    return {
      component: TableCheckboxComponent,
      valuePrepare: (row: any, col: ColumnSet) => CellRenderers.toField(row, col)
    };
  }
  public static toBadgeLink() {
    return {
      component: BadgeLinkComponent,
      valuePrepare: (row: any, col: ColumnSet) => ({
        text: row[col.key],
        link: row.id
      })
    };
  }
}
