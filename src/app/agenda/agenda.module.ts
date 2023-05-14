import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {AgendaRoutingModule} from './agenda-routing.module';
import {SharedModule} from '../shared/shared.module';

import {CalendarComponent} from './components/calendar/calendar.component';
import {HeaderComponent} from './components/header/header.component';
import {LayoutComponent} from './components/layout/layout.component';
import {CalMonthCellComponent} from './components/cal-month-cell/cal-month-cell.component';
import { CalMonthViewCommentComponent } from './components/cal-month-view-comment/cal-month-view-comment.component';
import { CalMonthAddCommentComponent } from './components/cal-month-add-comment/cal-month-add-comment.component';

@NgModule({
  declarations: [
    CalendarComponent,
    HeaderComponent,
    LayoutComponent,
    CalMonthCellComponent,
    CalMonthViewCommentComponent,
    CalMonthAddCommentComponent
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    SharedModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory})
  ]
})
export class AgendaModule {}
