import { Component, ViewEncapsulation } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  isLocked: boolean = true;

}
