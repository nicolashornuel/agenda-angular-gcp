import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {

  @Input() title: string = '';

  @HostBinding('class') get additionalClass() {
    return `f-grow row-start-center`;
  }

}
