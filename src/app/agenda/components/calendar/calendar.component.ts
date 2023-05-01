import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, take, takeUntil } from 'rxjs';
import { EventService } from 'src/app/core/services/event.service';
import { Holiday, HolidayService } from 'src/app/core/services/holiday.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() view!: CalendarView;
  @Input() viewDate!: Date;
  @Input() isLocked!: boolean;
  public events: CalendarEvent[] = [];
  public refresh = new Subject<void>();
  public activeDayIsOpen: boolean = false;
  public holidays: Holiday[] = [];
  public loading = false;

  constructor(
    private eventService: EventService,
    private destroy$: DestroyService,
    private holidayService: HolidayService
  ) {}

  ngOnInit(): void {
    this.eventService.getAll().pipe(takeUntil(this.destroy$)).subscribe(events => {
      console.log(events)
    })
  }

  public dayClicked({date, events}: {date: Date; events: CalendarEvent[]}): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      // this.viewDate = date;
    }
  }

  public beforeMonthViewRender({body}: {body: CalendarMonthViewDay[]}): void {
    this.holidayService.fetchHolidays().pipe(take(1)).subscribe((holidays: Holiday[]) => {
      body.forEach((day: CalendarMonthViewDay) => {
        holidays.forEach((holiday: Holiday) => {
          if (day.date >= holiday.start_date && day.date <= holiday.end_date) day.cssClass = 'holiday';
        });
      });
    });

  }

  public eventTimesChanged(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    this.events = this.eventService.eventTimesChanged(calendarEventTimesChangedEvent);
  }
}
