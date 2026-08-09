import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { Colors } from '@shared/models/button.type';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BadgeComponent {

  @Input() text: string | number = '';
  @Input() color: Colors = 'red';
  @Input('left') left: string = "100%";
  @Input('top') top: string = "0";
  @Input('position') position: string = "absolute";
  
  @HostBinding('class')
  get additionalClasses() {
    return this.color;
}

}
