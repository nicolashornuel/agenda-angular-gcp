import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss']
})
export class RightBarComponent {

  @Input('width') width: string = "600px";
  @Input('isOpen') isOpen: boolean = false;

}
