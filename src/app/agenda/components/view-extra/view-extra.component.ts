import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

export const collapseAnimation: AnimationTriggerMetadata = trigger('collapse', [
  state('void', style({
    height: 0,
    overflow: 'hidden',
    'padding-top': 0,
    'padding-bottom': 0,
  })
  ),
  state('*', style({
    height: '*',
    overflow: 'hidden',
    'padding-top': '*',
    'padding-bottom': '*',
  })
  ),
  transition('* => void', animate('150ms ease-out')),
  transition('void => *', animate('150ms ease-in')),
]);

@Component({
  selector: 'app-view-extra',
  templateUrl: './view-extra.component.html',
  styleUrls: ['./view-extra.component.scss'],
  animations: [collapseAnimation]
})
export class ViewExtraComponent {

  @Input() viewDate!: Date;
  @Input() isOpen!: boolean;

}
