import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TableSet } from '../../models/tableSet.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() tableSet!: TableSet;
  @Input() parentForm?: NgForm;
  @Input() readOnly?: boolean;

  constructor() {}

}
