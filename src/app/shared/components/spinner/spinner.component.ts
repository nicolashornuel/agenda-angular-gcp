import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
@Input() public size: string = '';

  @HostBinding('class')
  get additionalClasses() {
    return this.size === 'btn' ? 'relative' : '';
}

}
