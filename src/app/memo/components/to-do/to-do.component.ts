import { Component } from '@angular/core';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { InputCheckboxComponent, InputComponent, InputTextComponent } from '@shared/components/input/input.component';
import { PriorityComponent } from '@shared/components/priority/priority.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { TableSet } from '@shared/models/tableSet.interface';

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
        title: 'Résolu',
        type: 'custom',
        visible: true,
        renderComponent: InputCheckboxComponent
      },
      {
        key: 'description',
        title: 'Déscription',
        type: 'custom',
        visible: true,
        width: '40%',
        renderComponent: InputTextComponent
      },
      {
        key: 'priority',
        title: 'Priorité',
        type: 'custom',
        visible: true,
        renderComponent: PriorityComponent
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
        renderComponent: InputTextComponent
      }
    ],
    data: [
      {
        status: false,
        description: 'Acheter Vélo + siège enfant + barre enfant',
        priority: 3,
        creatingDate: '',
        updatingDate: '',
        category: 'Loisirs'
      }
    ]
  };

  public addNew(): void {
    const newItem = {
      status: false,
      description: '',
      priority: 0,
      creatingDate: '',
      updatingDate: '',
      category: ''
    }
    this.tableSet.data.push(newItem)
  }
  
}
