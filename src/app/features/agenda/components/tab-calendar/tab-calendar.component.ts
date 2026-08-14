import { Component } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-tab-calendar',
  templateUrl: './tab-calendar.component.html',
  styleUrls: ['./tab-calendar.component.scss']
})
export class TabCalendarComponent {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  isLocked: boolean = true;
}
