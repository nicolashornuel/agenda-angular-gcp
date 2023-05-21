import { Component } from '@angular/core';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { InputComponent } from '@shared/components/input/input.component';
import { PriorityComponent } from '@shared/components/priority/priority.component';
import { FieldSet, TableSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent {

  public tableSet: TableSet = {
    title: 'À faire',
    verticaltextHeader: false,
    hover: false,
    maxiHeight: '600px',
    height: '600px',
    columnSet: [
      {
        key: 'status',
        title: 'Statut',
        type: 'custom',
        visible: true,
        renderComponent: CheckboxComponent
      },
      {
        key: 'description',
        title: 'Déscription',
        type: 'custom',
        visible: true,
        renderComponent: InputComponent
      },
      {
        key: 'priority',
        title: 'Priorité',
        type: 'custom',
        visible: true,
        renderComponent: PriorityComponent
      },
      {
        key: 'date',
        title: 'Date',
        type: 'string',
        visible: true
      },
      {
        key: 'category',
        title: 'Catégorie',
        type: 'string',
        visible: true
      }
    ],
    data: [
      {
        status: false,
        description: 'Acheter Vélo + siège enfant + barre enfant',
        priority: 4,
        date: '',
        category: 'Loisirs'
      }
    ]
  };
  
}
