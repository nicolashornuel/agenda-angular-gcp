import { PriorityComponent } from '@shared/components/priority/priority.component';
import { TableCheckboxComponent } from '@shared/components/table-checkbox/table-checkbox.component';
import { TableInputComponent } from '@shared/components/table-input/table-input.component';
import { ColumnSet, RenderFieldSet, TableSet } from '@shared/models/tableSet.interface';

const columnToDo: ColumnSet[] = [
  {
    key: 'status',
    title: 'Résolu',
    type: 'custom',
    visible: true,
    render: {
      component: TableCheckboxComponent,
      valuePrepare: (row: any, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col),
      valueSave: (value: any) => null
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
      valuePrepare: (row: any, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col),
      valueSave: (value: any) => null
    }
  },
  {
    key: 'priority',
    title: 'Priorité',
    type: 'custom',
    visible: true,
    render: {
      component: PriorityComponent,
      valuePrepare: (row: any, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col),
      valueSave: (value: any) => null
    }
  },
  {
    key: 'creatingDate',
    title: 'Date de création',
    type: 'string',
    visible: true
  },
  {
    key: 'updatingDate',
    title: 'Dernière mise à jour',
    type: 'string',
    visible: true
  },
  {
    key: 'category',
    title: 'Catégorie',
    type: 'custom',
    visible: true,
    render: {
      component: TableInputComponent,
      valuePrepare: (row: any, col: ColumnSet) => RenderFieldSet.valuePrepare(row, col),
      valueSave: (value: any) => null
    }
  }
]

const dataToDo: any[] = [
  {
    status: false,
    description: 'Acheter Vélo + siège enfant + barre enfant',
    priority: 3,
    creatingDate: '',
    updatingDate: '',
    category: 'Loisirs'
  }
]

const emptyRow: any = {
    status: false,
    description: '',
    priority: 0,
    creatingDate: '',
    updatingDate: '',
    category: ''
}

export const tableToDo: TableSet = {
  title: 'À faire',
  verticaltextHeader: false,
  hover: false,
  height: 'calc(100vh - 240px)',
  columnSet: columnToDo,
  data: dataToDo,
  emptyRow: emptyRow
};
