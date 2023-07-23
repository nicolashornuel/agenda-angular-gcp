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

  @HostBinding('class')
  get additionalClasses() {
    return this.color;
}

}
