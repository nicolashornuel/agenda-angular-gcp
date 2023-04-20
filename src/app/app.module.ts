import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HeaderComponent } from './components/header/header.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { PredefinedEventComponent } from './components/predefined-event/predefined-event.component';
import { LayoutComponent } from './components/layout/layout.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HolidayService } from './services/holiday.service';

function initializeHolidays(holidays: HolidayService) {holidays.init()}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CalendarComponent,
    PredefinedEventComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeHolidays,
      deps: [HolidayService],
      multi: false
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeFr);
  }
}
