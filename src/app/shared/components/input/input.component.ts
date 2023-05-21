import { Component } from '@angular/core';
import { FieldComponent } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent extends FieldComponent {

  constructor() {
    super();
    console.log(this);
  }
}
