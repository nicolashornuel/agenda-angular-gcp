import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TableSet } from '../../models/tableSet.interface';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() tableSet!: TableSet;
  @Input() enableEditIndex: number | undefined | null;

  constructor(private alert: AlertService) {}

  public enableEditMethod(index: number): void {
    this.enableEditIndex = index;
  }

  private disableEditMethod(): void {
    this.enableEditIndex = null;
  }

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

  public async onDelete(rowData: any): Promise<void> {
    if (this.tableSet.actions) {
      const response = await this.tableSet.actions.delete(rowData.id);
      this.alert.success(`Delete ${response ? JSON.stringify(response) : ''}`);
    }
  }

  public onCancel(f: NgForm, rowData: any): void {
    for (const key in f.form.controls) {
      if (Object.prototype.hasOwnProperty.call(f.form.controls, key)) {
        f.form.get(key)?.setValue(rowData[key]);  
      }
    }
    this.disableEditMethod();
  }

}
