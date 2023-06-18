import {Component, OnInit} from '@angular/core';
import {PriorityComponent} from '@shared/components/priority/priority.component';
import {TableCheckboxComponent} from '@shared/components/table-checkbox/table-checkbox.component';
import {TableInputComponent} from '@shared/components/table-input/table-input.component';
import {ColumnSet, FieldSet, RenderFieldSet, TableSet} from '@shared/models/tableSet.interface';
import {DestroyService} from '@shared/services/destroy.service';
import {UtilService} from '@shared/services/util.service';
import {toDoDTO} from 'app/memo/models/to-do.model';
import {TodoService} from 'app/memo/service/todo.service';
import {takeUntil} from 'rxjs';

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
    actions: {
      save: (row: toDoDTO) => this.save(row),
      delete: (id: string) => this.delete(id)
    },
    columnSet: [
      {
        key: 'category',
        title: 'Catégorie',
        type: 'custom',
        visible: true,
        render: {
          component: TableInputComponent,
          valuePrepare: (row: toDoDTO, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col)
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
          valuePrepare: (row: toDoDTO, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col)
        }
      },
      {
        key: 'priority',
        title: 'Priorité',
        type: 'custom',
        visible: true,
        render: {
          component: PriorityComponent,
          valuePrepare: (row: toDoDTO, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col)
        }
      },
      {
        key: 'creatingDate',
        title: 'Date de création',
        type: 'html',
        visible: true,
        innerHTML: (row: any, col: ColumnSet) => `<div class="txt-nowrap">${this.util.formatDate(row[col.key])}</div>`
      },
      {
        key: 'updatingDate',
        title: 'Dernière mise à jour',
        type: 'html',
        visible: true,
        width: '15%',
        innerHTML: (row: any, col: ColumnSet) => `<div class="txt-nowrap">${this.util.formatDate(row[col.key])}</div>`
      },
      {
        key: 'isResolved',
        title: 'Résolu',
        type: 'custom',
        visible: true,
        render: {
          component: TableCheckboxComponent,
          valuePrepare: (row: toDoDTO, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col)
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
  private dataSource!: toDoDTO[];

  public enableEditIndex: number | null = null;

  constructor(private toDoService: TodoService, private util: UtilService, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.initializeList();
  }

  /**
   * GET all
   *
   * @private
   * @memberof ToDoComponent
   */
  private initializeList(): void {
    this.toDoService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((toDoDTOList: toDoDTO[]) => {
        this.dataSource = toDoDTOList;
        this.tableSet.data = this.dataSource;
      });
  }

  /**
   * ADD new empty
   *
   * @memberof ToDoComponent
   */
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
    this.enableEditIndex = 0;
  }

  /**
   * DISPLAY column
   *
   * @param {boolean} value
   * @param {*} fieldSet
   * @memberof ToDoComponent
   */
  public onShowColumn(value: boolean, fieldSet: FieldSet) {
    this.tableSet.columnSet.find((columnSet: ColumnSet) => columnSet.title === fieldSet.name)!.visible = value;
  }

  /**
   * FILTER by keyword
   *
   * @param {string} keyword
   * @memberof ToDoComponent
   */
  public applyFilter(keyword: string): void {
    keyword != ''
      ? (this.tableSet.data = [
          ...this.dataSource.filter(
            (data: toDoDTO) => data.description.includes(keyword) || data.category.includes(keyword)
          )
        ])
      : (this.tableSet.data = [...this.dataSource]);
  }

  /**
   * FILTER by isNotResolved
   *
   * @param {boolean} value
   * @memberof ToDoComponent
   */
  public filterByNoResolved(value: boolean): void {
    value
      ? (this.tableSet.data = [...this.dataSource.filter((data: toDoDTO) => data.isResolved === false)])
      : (this.tableSet.data = [...this.dataSource]);
  }

  /**
   * SAVE one
   *
   * @param {toDoDTO} toDoDTO
   * @return {*}  {Promise<void>}
   * @memberof ToDoComponent
   */
  public async save(toDoDTO: toDoDTO): Promise<void> {
    toDoDTO.id ? await this.toDoService.update(toDoDTO) : await this.toDoService.save(toDoDTO);
  }

  /**
   * DELETE one
   *
   * @param {string} id
   * @return {*}  {Promise<void>}
   * @memberof ToDoComponent
   */
  public async delete(id: string): Promise<void> {
    await this.toDoService.delete(id);
  }
}
