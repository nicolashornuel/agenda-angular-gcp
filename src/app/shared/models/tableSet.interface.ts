import { FormArray, FormControl, NgForm, NgModel } from "@angular/forms";

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
    valuePrepare?: (value: any) => any,
    renderComponent?: any,
    valueSave?: (value: any) => any,
}

export interface TableCellCustom {
    columnSet: ColumnSet,
    rowData?: any,
    input?: NgModel | NgForm | FormArray | FormControl,
    inputSet?: TableInputSet,
    isUpdating?: boolean,
    readOnly?: boolean;
}

export interface TableInputSet {
    name: string;
    value: string | boolean;
    options?: string[];
}

export interface TableButton {
    icon: string;
    action: (value: any) => any,
}

export interface  TablePopover {
    title: string,
    inputSets: TableInputSet[],
}