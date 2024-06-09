import { Component, ViewEncapsulation } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-page-agenda',
  templateUrl: './page-agenda.component.html',
  styleUrls: ['./page-agenda.component.scss']
})
export class PageAgendaComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  isLocked: boolean = true;

}
