import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CalendarMonthViewDay } from 'angular-calendar';

export const collapseAnimation: AnimationTriggerMetadata = trigger('collapse', [
  state('open', style({
      height: 0
    })
  ),
  state('close', style({
      height: '*'
    })
  ),
  transition('open => closed', animate('150ms ease-out')),
  transition('closed => open', animate('150ms ease-in')),
]);

@Component({
  selector: 'app-view-extra',
  templateUrl: './view-extra.component.html',
  styleUrls: ['./view-extra.component.scss'],
  animations: [collapseAnimation]
})
export class ViewExtraComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    console.log(this.viewDate);
  }
  ngOnInit(): void {

  }
  @Input() viewDate!: any;
  @Input() locale!: string;

}
