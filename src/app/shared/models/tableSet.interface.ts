import { BadgeLinkComponent } from '@shared/components/badge-link/badge-link.component';
import { TableCheckboxComponent } from '@shared/components/table-checkbox/table-checkbox.component';
import { FieldSet, Nameable } from '@shared/models/fieldSet.model';
import { Color } from './color.enum';
import { TableInputComponent } from '@shared/components/table-input/table-input.component';
import { InputTextComponent } from '@shared/components/input-text/input-text.component';

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

export class TableSet implements TableSet {
  constructor(height: string) {
    this.height = height;
    this.verticaltextHeader = false,
    this.hover = false,
    this.height = height, //  'calc(100vh - 240px)',
    this.columnSet = [],
    this.actionSet = [],
    this.data = []
  }
}

export interface ActionSet {
  icon: string;
  method: (row: any, index?: number) => Promise<any> | void;
}

export class ActionSet {
  public static readonly EDIT = "fas fa-pencil-alt";
  public static readonly DELETE = "fas fa-trash-alt";
  public static readonly CANCEL = "fas fa-times";
  public static readonly SAVE = "fas fa-save";
  constructor(icon: string, method: (row: any, index?: number) => Promise<any> | void) {
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

  setWidth(width: string) {
    this.width = width;
    return this;
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

  public static toInputText() {
    return {
      component: TableInputComponent,
      valuePrepare: (row: any, col: ColumnSet) => CellRenderers.toField(row, col)
    };
  }

  public static toSimpleBadge() {
    return {
      component: BadgeLinkComponent,
      valuePrepare: (row: any, col: ColumnSet) => ({
        text: (row[col.key] as Nameable).name,
        color: (row[col.key] as any).color ?? 'light'
      })
    };
  }

  public static toBoolean(): (row: any, col: ColumnSet) => string {
    return (row: any, col: ColumnSet) => row[col.key] ? `<i class="fa-solid fa-check green"></i>`: `<i class="fa-solid fa-xmark red"></i>`;
  }
  
  public static toDevise(suffix: string): (row: any, col: ColumnSet) => string {
    return (row: any, col: ColumnSet) => `${row[col.key].toFixed(2)} ${suffix}`;
  }

  public static toBadgeLink(color: Color, prefix: string, tooltip: string) {
    return {
      component: BadgeLinkComponent,
      valuePrepare: (row: any, col: ColumnSet) => ({
        text: (row[col.key] as FieldSet).name,
        link: prefix + (row[col.key] as FieldSet).value,
        tooltip,
        color
      })
    };
  }
  
}
