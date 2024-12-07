import { EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BadgeLinkComponent } from '@shared/components/badge-link/badge-link.component';
import { FileStorage } from '@shared/components/input-file/input-file.component';
import { Selectable } from '@shared/components/select/select.component';
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

export interface Nameable {
  name: string;
}

interface DataColumn<T extends 'string' | 'custom' | 'html' | 'date'> {
  key: string;
  title: string;
  type: T;
  visible: boolean;
  width: string | undefined;
}
class DataColumn<T> implements DataColumn<T> {
  constructor(fieldSet: FieldSet, visible: boolean, type: T) {
    (this.key = fieldSet.key!), (this.title = fieldSet.name), (this.visible = visible)
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

export interface FieldSet extends Nameable {
  key?: string;
  value?: string | boolean | number | FileStorage | any | Selectable<any>;
  disabled?: boolean;
  required?: boolean;
  parentForm?: NgForm;
}

export class FieldSet {
  constructor(name: string, value: string | boolean | number | FileStorage | any | Selectable<any>, disabled: boolean = false, required: boolean = false) {
    (this.name = name), (this.value = value), (this.disabled = disabled), (this.required = required);
  }
}
export class DataField extends FieldSet {
  constructor(fieldSet: FieldSet, object: any) {
    super(fieldSet.name, object ? object[fieldSet.key!] : "")
  }
}
export class DataList extends FieldSet {
  options: Set<string>;
  constructor(fieldSet: FieldSet, object: any, options: Set<string>) {
    super(fieldSet.name, object ? object[fieldSet.key!] : {})
    this.options = options
  }
}
export class DataSelect<T extends Nameable> extends FieldSet {
  options: Selectable<T>[];
  constructor(fieldSet: FieldSet, object: any, options: Selectable<T>[]) {
    super(fieldSet.name, object ? object[fieldSet.key!] : {})
    this.options = options
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
  public static toSimpleBadge() {
    return {
      component: BadgeLinkComponent,
      valuePrepare: (row: any, col: ColumnSet) => ({
        text: row[col.key]
      })
    };
  }
}
