import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonGroupComponent {
  @Input() size: 'tiny' | 'small' | 'regular' = 'regular';
}
