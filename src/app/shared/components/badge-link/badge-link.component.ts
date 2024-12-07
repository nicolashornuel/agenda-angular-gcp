import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Colors } from '@shared/models/button.type';

@Component({
  selector: 'app-badge-link',
  templateUrl: './badge-link.component.html',
  styleUrls: ['./badge-link.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BadgeLinkComponent {

  @Input() data!: {text: string, color?: Colors, link?: string};

  @HostBinding('class')
  get additionalClasses() {
    return this.data.color ?? 'red' ;
}


}
