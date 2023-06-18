import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from '@shared/services/alert.service';
import { TableSet } from '../../models/tableSet.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() tableSet!: TableSet;
  @Input() enableEditIndex!: number | null;
  @Output() enableEditIndexChange = new EventEmitter<number | null>();

  constructor(private alert: AlertService) {}

  public enableEditMethod(index: number): void {
    this.enableEditIndexChange.emit(index);
  }

  private disableEditMethod(): void {
    this.enableEditIndexChange.emit(null);
  }

  /**
   * Action inline SAVE
   *
   * @param {NgForm} f
   * @param {*} rowData
   * @return {*}  {Promise<void>}
   * @memberof TableComponent
   */
  public async onSave(f: NgForm, rowData: any): Promise<void> {
    for (const key in f.form.controls) {
      if (Object.prototype.hasOwnProperty.call(f.form.controls, key)) {
        rowData[key] = f.form.get(key)?.value;
      }
    }
    if (this.tableSet.actions) {
      const response = await this.tableSet.actions.save(rowData);
      this.alert.success(`Save ${response ? JSON.stringify(response) : ''}`);
      this.disableEditMethod();
    }
  }

  /**
   * Action inline DELETE
   *
   * @param {number} i
   * @return {*}  {Promise<void>}
   * @memberof TableComponent
   */
  public async onDelete(i: number): Promise<void> {
    const rowData = this.tableSet.data[i];
    if (rowData.id && this.tableSet.actions && this.tableSet.actions.delete) {
      const response = await this.tableSet.actions.delete(rowData.id);
      this.alert.success(`Delete ${response ? JSON.stringify(response) : ''}`);
    } else if (!rowData.id) {
      this.tableSet.data.splice(i, 1);
    }
  }

  /**
   * Action inline CANCEL
   *
   * @param {NgForm} f
   * @param {*} rowData
   * @memberof TableComponent
   */
  public onCancel(f: NgForm, rowData: any): void {
    for (const key in f.form.controls) {
      if (Object.prototype.hasOwnProperty.call(f.form.controls, key)) {
        f.form.get(key)?.setValue(rowData[key]);
      }
    }
    this.disableEditMethod();
  }
}
