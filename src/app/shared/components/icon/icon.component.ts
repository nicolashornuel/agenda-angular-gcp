import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  
  @Input() path!: string;
  @Input() size: string = '20px';
  @Input() color: string = 'currentColor';

  @HostBinding('style.width') get width() {
    return this.size;
  }
  @HostBinding('style.height') get height() {
    return this.size;
  }
  @HostBinding('style.display') get display() {
    return 'block';
  }

}
