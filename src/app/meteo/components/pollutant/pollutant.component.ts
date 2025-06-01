import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pollutant',
  templateUrl: './pollutant.component.html',
  styleUrls: ['./pollutant.component.scss']
})
export class PollutantComponent {

  @Input() public pollutants: any;
  @Input() view: 'col' | 'row' = 'col';

}
