import { Component } from '@angular/core';
import { FieldComponent } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent extends FieldComponent {

  constructor() {
    super()
  }

}
