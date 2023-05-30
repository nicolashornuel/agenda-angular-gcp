import { Component } from '@angular/core';
import { tableToDo } from 'app/memo/models/to-do.constant';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent {

  public tableSet = tableToDo;

  public addNew(): void {
    const newItem = this.tableSet.emptyRow;
    this.tableSet.data.push(newItem);
  }
  
}
