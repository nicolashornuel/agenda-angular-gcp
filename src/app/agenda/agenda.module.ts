import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SharedModule } from '@shared/shared.module';
import { AgendaRoutingModule } from './agenda-routing.module';

import { CalBodyComponent } from './components/cal-body/cal-body.component';
import { CalHeaderComponent } from './components/cal-header/cal-header.component';
import { CalMonthAddCommentComponent } from './components/cal-month-add-comment/cal-month-add-comment.component';
import { CalMonthCellComponent } from './components/cal-month-cell/cal-month-cell.component';
import { CalMonthViewCommentComponent } from './components/cal-month-view-comment/cal-month-view-comment.component';
import { EditBirthdayComponent } from './components/edit-birthday/edit-birthday.component';
import { EditRecurringEventTypeComponent } from './components/edit-recurring-event-type/edit-recurring-event-type.component';
import { EditRecurringEventComponent } from './components/edit-recurring-event/edit-recurring-event.component';
import { ListBirthdayComponent } from './components/list-birthday/list-birthday.component';
import { ListRecurringEventTypeComponent } from './components/list-recurring-event-type/list-recurring-event-type.component';
import { ListRecurringEventComponent } from './components/list-recurring-event/list-recurring-event.component';
import { TabCalendarComponent } from './components/tab-calendar/tab-calendar.component';
import { TabRecurrentEventComponent } from './components/tab-recurrent-event/tab-recurrent-event.component';
import { ScrollTodayDirective } from './directives/scroll-today.directive';
import { PageAgendaComponent } from './page/page-agenda.component';
import { ListEventComponent } from './components/list-event/list-event.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { ListCheckboxEventComponent } from './components/list-checkbox-event/list-checkbox-event.component';
import { EditCheckboxEventComponent } from './components/edit-checkbox-event/edit-checkbox-event.component';

@NgModule({
  declarations: [
    CalMonthCellComponent,
    CalMonthViewCommentComponent,
    CalMonthAddCommentComponent,
    CalHeaderComponent,
    CalBodyComponent,
    ScrollTodayDirective,
    PageAgendaComponent,
    TabRecurrentEventComponent,
    TabCalendarComponent,
    ListRecurringEventComponent,
    EditRecurringEventComponent,
    EditRecurringEventTypeComponent,
    ListRecurringEventTypeComponent,
    ListBirthdayComponent,
    EditBirthdayComponent,
    ListEventComponent,
    EditEventComponent,
    ListCheckboxEventComponent,
    EditCheckboxEventComponent
    ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    SharedModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [DatePipe]
})
export class AgendaModule { }
