import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AgendaRoutingModule } from './agenda-routing.module';
import { SharedModule } from '@shared/shared.module';

import { CalMonthCellComponent } from './components/cal-month-cell/cal-month-cell.component';
import { CalMonthViewCommentComponent } from './components/cal-month-view-comment/cal-month-view-comment.component';
import { CalMonthAddCommentComponent } from './components/cal-month-add-comment/cal-month-add-comment.component';
import { CalHeaderComponent } from './components/cal-header/cal-header.component';
import { CalBodyComponent } from './components/cal-body/cal-body.component';
import { ScrollTodayDirective } from './directives/scroll-today.directive';
import { PageAgendaComponent } from './page/page-agenda.component';
import { TabRecurrentEventComponent } from './components/tab-recurrent-event/tab-recurrent-event.component';
import { TabCalendarComponent } from './components/tab-calendar/tab-calendar.component';
import { RecurrentEventEditComponent } from './components/recurrent-event-edit/recurrent-event-edit.component';

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
    RecurrentEventEditComponent
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
