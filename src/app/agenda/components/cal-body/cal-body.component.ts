import {
  CalendarBirthdayService,
  CalendarCheckboxService,
  CalendarConfirmedService
} from '@agenda/services/agenda.firestore.service';
import { DayClickedService } from '@agenda/services/agenda.observable.service';
import { Holiday, HolidayService } from '@agenda/services/holiday.service';
import { PublicHoliday, PublicHolidayService } from '@agenda/services/public-holiday.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { isSameDay } from 'date-fns';
import { combineLatest, take, takeUntil } from 'rxjs';
import { CalendarBirthday, CalendarCheckbox } from '../../models/calEvent.model';

@Component({
  selector: 'app-cal-body',
  templateUrl: './cal-body.component.html',
  styleUrls: ['./cal-body.component.scss']
})
export class CalBodyComponent implements OnChanges {
  @Input() view!: CalendarView;
  @Input() viewDate!: Date;
  @Input() isLocked!: boolean;
  public events: CalendarEvent[] = [];
  public calRecurringEvents: CalendarCheckbox[] = [];
  public holidays: Holiday[] = [];
  public birthdays: CalendarBirthday[] = [];
  private publicHolidays: PublicHoliday[] = [];
  public loading = false;
  public activeDayIsOpen: boolean = true;

  constructor(
    private holidayService: HolidayService,
    private calBirthdayService: CalendarBirthdayService,
    private dayService: DayClickedService,
    private destroy$: DestroyService,
    private publicHolidayService: PublicHolidayService,
    private calendarCheckboxEventService: CalendarCheckboxService,
    private calendarEventService: CalendarConfirmedService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewDate']) this.initializeData();
    //this.activeDayIsOpen = isSameMonth(new Date(), this.viewDate) ? true : false;
  }

  private initializeData(): void {
    this.loading = true;
    combineLatest([
      this.holidayService.getByYear(this.viewDate),
      this.publicHolidayService.getByYear(this.viewDate),
      this.calBirthdayService.getByMonth(this.viewDate),
      this.calendarCheckboxEventService.getAllWithRecordRules(),
      this.calendarEventService.getByMonth(this.viewDate)
    ])
      .pipe(take(1))
      .subscribe(([holidays, publicHolidays, birthdays, calendarCheckboxEvents, confirmedRecurringEvent]) => {
        this.holidays = holidays;
        this.publicHolidays = publicHolidays;
        this.birthdays = birthdays;
        this.calRecurringEvents = calendarCheckboxEvents;
        this.events = confirmedRecurringEvent;
        this.loading = false;
      });
    this.dayService.get$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      if (date) {
        if (!isSameDay(this.viewDate, date)) this.viewDate = date;
        this.activeDayIsOpen = true;
      } else {
        this.activeDayIsOpen = false;
      }
    });
  }

  public beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day: CalendarMonthViewDay) => {
      this.holidays.forEach((holiday: Holiday) => {
        if (day.date >= holiday.start && day.date <= holiday.end) {
          day.cssClass = 'holiday';
          day.meta = {
            ...day.meta,
            publicEvent: holiday.description
          };
        }
      });

      this.publicHolidays.forEach((publicHoliday: PublicHoliday) => {
        if (isSameDay(day.date, publicHoliday.date)) {
          day.cssClass = 'public-holiday';
          day.meta = {
            ...day.meta,
            publicEvent: publicHoliday.localName
          };
        }
      });
    });
  }

  public eventTimesChanged(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    console.log('eventTimesChanged');
    //this.events = this.calEventService.eventTimesChanged(calendarEventTimesChangedEvent);
  }
}
