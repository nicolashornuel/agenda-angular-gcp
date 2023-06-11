import {Component, OnInit} from '@angular/core';
import {ColumnSet, FieldSet} from '@shared/models/tableSet.interface';
import {tableToDo} from 'app/memo/models/to-do.constant';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {
  public tableSet = {...tableToDo};
  public popover = {
    title: 'colonne visible',
    fieldSets: tableToDo.columnSet.map((col: ColumnSet) => {
      return {
        name: col.title,
        value: col.visible,
        disabled: false,
        required: false
      };
    })
  };

  constructor() {}

  ngOnInit(): void {}

  public addNew(): void {
    const newItem = this.tableSet.emptyRow;
    this.tableSet.data.unshift(newItem);
  }

  public onSave(fieldSet: FieldSet) {
    console.log(fieldSet);
    
    this.tableSet.columnSet.find((columnSet: ColumnSet) => columnSet.title === fieldSet.name)!.visible =
      fieldSet.value as boolean;
  }

  public applyFilter(keyword: string): void {
    keyword != ''
      ? (this.tableSet.data = [
          ...tableToDo.data.filter(data => data.description.includes(keyword) || data.category.includes(keyword))
        ])
      : (this.tableSet.data = [...tableToDo.data]);
  }
}
