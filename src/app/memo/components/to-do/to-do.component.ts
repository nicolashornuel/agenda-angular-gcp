import {Component, OnInit} from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
import {PriorityComponent} from '@shared/components/priority/priority.component';
import {TableCheckboxComponent} from '@shared/components/table-checkbox/table-checkbox.component';
import {TableInputComponent} from '@shared/components/table-input/table-input.component';
import {ColumnSet, FieldSet, RenderFieldSet, TableSet} from '@shared/models/tableSet.interface';
import {toDoDTO, toDoEntity} from 'app/memo/models/to-do.model';
import {TodoService} from 'app/memo/service/todo.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {
  public tableSet: TableSet = {
    title: 'À faire',
    verticaltextHeader: false,
    hover: false,
    height: 'calc(100vh - 240px)',
    columnSet: [
      {
        key: 'isResolved',
        title: 'Résolu',
        type: 'custom',
        visible: true,
        render: {
          component: TableCheckboxComponent,
          valuePrepare: (row: toDoDTO, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col),
          valueSave: (row: toDoDTO) => this.save(row)
        }
      },
      {
        key: 'description',
        title: 'Déscription',
        type: 'custom',
        visible: true,
        width: '40%',
        render: {
          component: TableInputComponent,
          valuePrepare: (row: toDoDTO, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col),
          valueSave: (row: toDoDTO) => this.save(row)
        }
      },
      {
        key: 'priority',
        title: 'Priorité',
        type: 'custom',
        visible: true,
        render: {
          component: PriorityComponent,
          valuePrepare: (row: toDoDTO, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col),
          valueSave: (row: toDoDTO) => this.save(row)
        }
      },
      {
        key: 'creatingDate',
        title: 'Date de création',
        type: 'html',
        visible: true,
        innerHTML: (row: any, col: ColumnSet) => `<div>${this.formatDate(row[col.key])}</div>`
      },
      {
        key: 'updatingDate',
        title: 'Dernière mise à jour',
        type: 'html',
        visible: true,
        innerHTML: (row: any, col: ColumnSet) => `<div>${this.formatDate(row[col.key])}</div>`
      },
      {
        key: 'category',
        title: 'Catégorie',
        type: 'custom',
        visible: true,
        render: {
          component: TableInputComponent,
          valuePrepare: (row: toDoDTO, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col),
          valueSave: (row: toDoDTO) => this.save(row)
        }
      }
    ],
    data: []
  };
  public popover = {
    title: 'colonne visible',
    fieldSets: this.tableSet.columnSet.map((col: ColumnSet) => {
      return {
        name: col.title,
        value: col.visible,
        disabled: false,
        required: false
      };
    })
  };

  private data: toDoDTO[] = [
    {
      isResolved: false,
      description: 'Acheter Vélo + siège enfant + barre enfant',
      priority: 3,
      creatingDate: new Date(),
      updatingDate: undefined,
      category: 'Loisirs'
    }
  ];

  constructor(private toDoService: TodoService) {}

  ngOnInit(): void {
    this.tableSet.data = this.data;
  }

  public addNew(): void {
    const newItem = {
      isResolved: false,
      description: '',
      priority: 0,
      creatingDate: new Date(),
      updatingDate: undefined,
      category: ''
    };
    this.tableSet.data.unshift(newItem);
  }

  public onShowColumn(fieldSet: FieldSet) {
    this.tableSet.columnSet.find((columnSet: ColumnSet) => columnSet.title === fieldSet.name)!.visible =
      fieldSet.value as boolean;
  }

  public applyFilter(keyword: string): void {
    keyword != ''
      ? (this.tableSet.data = [
          ...this.data.filter((data: toDoDTO) => data.description.includes(keyword) || data.category.includes(keyword))
        ])
      : (this.tableSet.data = [...this.data]);
  }

  private formatDate(date: Date): string {
    //const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return date ? date.toLocaleDateString("fr-FR") : '';
  }

  public save(item: toDoDTO): void {
    const entity: toDoEntity = {
      isResolved: item.isResolved,
      description: item.description,
      priority: item.priority,
      creatingDate: item.id ? Timestamp.fromDate(new Date(item.creatingDate)) : Timestamp.fromDate(new Date()),
      updatingDate: item.id ? Timestamp.fromDate(new Date()) : undefined,
      category: item.category
    };
    console.log(item);
    console.log(entity);
    //this.toDoService.save()
  }
}
