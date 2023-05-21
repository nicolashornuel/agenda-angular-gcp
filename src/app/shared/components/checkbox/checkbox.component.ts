import { Component, OnInit } from '@angular/core';
import { FieldComponent } from '@shared/models/tableSet.interface';


@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends FieldComponent implements OnInit {

  constructor() {
    super();
  }


  ngOnInit(): void {
    console.log(this.data);
  }


}
