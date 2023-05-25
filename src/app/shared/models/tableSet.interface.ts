import { Injectable, Input } from "@angular/core";

export interface TableSet {
    title: string,
    verticaltextHeader: boolean,
    hover: boolean,
    maxiHeight?: string,
    height?: string,
    columnSet: ColumnSet[],
    data: any,
    openDetailByClickRow?: (row: any) => string,
}

export interface ColumnSet {
    key: string,
    title: string,
    type: 'custom' | 'string',
    visible: boolean,
    width?: string,
    valuePrepare?: (value: any) => any,
    renderComponent?: any,
    valueSave?: (value: any) => any,
}

export interface FieldSet {
    name: string,
    value: string | boolean | number,
    disabled: boolean,
    options?: string[]
  }

@Injectable()
export abstract class FieldComponent {
    @Input() data!: FieldSet;

    constructor() {}

    onSave(value: string | number | boolean): void {
        console.log(value);
    }
}