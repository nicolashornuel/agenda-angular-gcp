import { Component, Inject } from '@angular/core';
import { FieldComponent } from '@shared/models/tableSet.interface';

/* type GetMyClassT<C extends InputComponent<any>> = C extends InputComponent<infer T> ? T : unknown; */

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent<T> extends FieldComponent {

  value: T;
  constructor(@Inject('type') type: T) {
    super();
      this.value = type;
      console.log(typeof this.value);
      console.log(InputComponent.constructor);
      
      
  }


}
