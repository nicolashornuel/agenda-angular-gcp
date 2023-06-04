import { Component, OnInit } from '@angular/core';
import { ColumnSet, FieldSet } from '@shared/models/tableSet.interface';
import { tableToDo } from 'app/memo/models/to-do.constant';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {
  public tableSet = tableToDo;
  public popover = {
    title: 'colonne visible',
    fieldSets: tableToDo.columnSet.map((col: ColumnSet) => {
      return {
        name: col.title,
        value: col.visible,
        disabled: false
      };
    })
  };

  constructor() {}

  ngOnInit(): void {}

  public addNew(): void {
    const newItem = this.tableSet.emptyRow;
    this.tableSet.data.push(newItem);
  }

  public onSave(fieldSet: FieldSet) {
    this.tableSet.columnSet.find((columnSet: ColumnSet) => columnSet.title === fieldSet.name)!.visible =
      fieldSet.value as boolean;
  }
}
