import { Component } from '@angular/core';
import { FieldComponent } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent extends FieldComponent {
 
  constructor() {
    super();
  }

}
