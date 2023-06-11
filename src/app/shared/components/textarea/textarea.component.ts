import { Component, Input } from '@angular/core';
import { AbstractInputComponent } from '@shared/abstracts/input.component';
import { FieldSet } from '@shared/models/tableSet.interface';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent extends AbstractInputComponent {
  @Input() data!: FieldSet;

  constructor() {
    super();
  }

}
