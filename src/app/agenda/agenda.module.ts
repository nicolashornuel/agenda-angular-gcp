import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {AgendaRoutingModule} from './agenda-routing.module';
import {SharedModule} from '../shared/shared.module';

import {CalendarComponent} from './components/calendar/calendar.component';
import {HeaderComponent} from './components/header/header.component';
import {LayoutComponent} from './components/layout/layout.component';
import {PredefinedEventComponent} from './components/predefined-event/predefined-event.component';
import {CalMonthCellComponent} from './components/cal-month-cell/cal-month-cell.component';
import { AddExtraModalComponent } from './components/add-extra-modal/add-extra-modal.component';

@NgModule({
  declarations: [
    CalendarComponent,
    HeaderComponent,
    LayoutComponent,
    PredefinedEventComponent,
    CalMonthCellComponent,
    AddExtraModalComponent
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    SharedModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory})
  ]
})
export class AgendaModule {}
