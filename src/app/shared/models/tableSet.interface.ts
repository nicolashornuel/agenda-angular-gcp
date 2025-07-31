import { ComponentRef, EventEmitter } from '@angular/core';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { BadgeLinkComponent } from '@shared/components/badge-link/badge-link.component';
import { InputCheckboxComponent } from '@shared/components/input-checkbox/input-checkbox.component';
import { InputSelectComponent } from '@shared/components/input-select/input-select.component';
import { InputStarComponent } from '@shared/components/input-star/input-star.component';
import { InputTextComponent } from '@shared/components/input-text/input-text.component';
import { FieldSet, Nameable, Selectable } from '@shared/models/fieldSet.model';
import { Color } from './color.enum';
import { InputNumberComponent } from '@shared/components/input-number/input-number.component';

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
    (this.verticaltextHeader = false),
      (this.hover = false),
      (this.height = height), //  'calc(100vh - 240px)',
      (this.columnSet = []),
      (this.actionSet = []),
      (this.data = []);
  }
}

export interface ActionSet {
  icon: string;
  method: (row: any, index?: number) => Promise<any> | void;
}

export class ActionSet {
  public static readonly EDIT = 'fas fa-pencil-alt';
  public static readonly DELETE = 'fas fa-trash-alt';
  public static readonly CANCEL = 'fas fa-times';
  public static readonly SAVE = 'fas fa-save';
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
  render?: ColumnCustomRenderer<any, any, any>;
}

export interface ColumnCustomRenderer<T, C, F> {
  component: C;
  bind: (row: T, key: string, componentRef: ComponentRef<C>) => void;
  listener?: (componentRef: ComponentRef<C>) => EventEmitter<F>;
  valueSave?: (row: T) => any;
}

interface DataColumn<T extends 'string' | 'custom' | 'html' | 'date'> {
  key: string;
  title: string;
  type: T;
  visible: boolean;
  width?: string;
}

class DataColumn<T> implements DataColumn<T> {
  constructor(fieldSet: FieldSet, visible: boolean, type: T) {
    (this.key = fieldSet.key!), (this.title = fieldSet.name), (this.visible = visible), (this.type = type);
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
  render: ColumnCustomRenderer<any, any, any>;
  constructor(name: Nameable, visible: boolean, render: ColumnCustomRenderer<any, any, any>) {
    super(name, visible, 'custom');
    this.render = render;
  }
}

export class CellRenderers {
  public static toInputComponent(
    component: any extends AbstractInputComponent ? AbstractInputComponent : any
  ): ColumnCustomRenderer<any, any, any> {
    return {
      component,
      bind: (row: any, key: string, componentRef: ComponentRef<AbstractInputComponent>) => {
        componentRef.instance.value = row[key];
      },
      listener: (componentRef: ComponentRef<AbstractInputComponent>) => componentRef.instance.onModelChange
    };
  }

  public static toMonthName() {
    return (row: any, col: ColumnSet) =>
      `<div class="txt-nowrap">${
        row[col.key] ? new Date(2000, row[col.key] - 1, 1).toLocaleDateString('fr-FR', { month: 'long' }) : ''
      }</div>`;
  }
  
  public static toDate(row: any, col: ColumnSet, options: Intl.DateTimeFormatOptions): string {
    return `<div class="txt-nowrap">${
      row[col.key] ? new Date(row[col.key]).toLocaleDateString('fr-FR', options) : ''
    }</div>`;
  }

  public static toShortDate() {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return (row: any, col: ColumnSet) => CellRenderers.toDate(row, col, options);
  }

  public static toLongDate() {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    return (row: any, col: ColumnSet) => CellRenderers.toDate(row, col, options);
  }

  public static toCheckBox() {
    return CellRenderers.toInputComponent(InputCheckboxComponent);
  }

  public static toInputText() {
    return CellRenderers.toInputComponent(InputTextComponent);
  }

  public static toInputNumber() {
    return CellRenderers.toInputComponent(InputNumberComponent);
  }

  public static toInputSelect(options: Selectable<any>[]): ColumnCustomRenderer<any, any, any> {
    return {
      component: InputSelectComponent,
      bind: (row: any, key: string, componentRef: ComponentRef<InputSelectComponent<any>>) => {
        componentRef.instance.value = row[key];
        componentRef.instance.options = options;
      },
      listener: (componentRef: ComponentRef<InputSelectComponent<any>>) => componentRef.instance.onModelChange
    };
  }

  public static toSimpleBadge() {
    return {
      component: BadgeLinkComponent,
      bind: (row: any, key: string, componentRef: ComponentRef<BadgeLinkComponent>) => {
        componentRef.instance.data = {
          text: (row[key] as Nameable).name,
          color: (row[key] as any).color ?? 'light'
        };
      }
    };
  }
  public static toName() {
    return (row: any, col: ColumnSet) => (row[col.key] as Nameable).name;
  }

  public static toBoolean(): (row: any, col: ColumnSet) => string {
    return (row: any, col: ColumnSet) =>
      row[col.key] ? `<i class="fa-solid fa-check green"></i>` : `<i class="fa-solid fa-xmark red"></i>`;
  }

  public static toDevise(suffix: string): (row: any, col: ColumnSet) => string {
    return (row: any, col: ColumnSet) => `${row[col.key].toFixed(2)} ${suffix}`;
  }

  public static toBadgeLink(color: Color, prefix: string, tooltip?: string) {
    return {
      component: BadgeLinkComponent,
      bind: (row: any, key: string, componentRef: ComponentRef<BadgeLinkComponent>) => {
        componentRef.instance.data = {
          text: (row[key] as FieldSet).name,
          link: prefix + (row[key] as FieldSet).value,
          tooltip,
          color
        };
      }
    };
  }

  public static toPriority() {
    return CellRenderers.toInputComponent(InputStarComponent);
  }
}
