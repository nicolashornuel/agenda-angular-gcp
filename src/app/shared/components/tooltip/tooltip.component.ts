import { Component, HostBinding } from '@angular/core';
import { TooltipParam } from '@shared/models/tooltipParam.interface';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {

  param!: TooltipParam;

  @HostBinding('style.position') get position() {
    return 'absolute';
  }

}
