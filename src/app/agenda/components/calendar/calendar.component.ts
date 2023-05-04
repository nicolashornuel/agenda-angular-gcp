import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { combineLatest, take } from 'rxjs';
import { EventService } from 'src/app/core/services/event.service';
import { Holiday, HolidayService } from 'src/app/core/services/holiday.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() view!: CalendarView;
  @Input() viewDate!: Date;
  @Input() isLocked!: boolean;
  public events: CalendarEvent[] = [];
  private holidays: Holiday[] = []
  public loading = false;

  constructor( private eventService: EventService, private holidayService: HolidayService) { }

  ngOnInit(): void {
    this.initializeData();
  }

  /**
   * fetch events & holidays 
   *
   * @private
   * @memberof CalendarComponent
   */
  private initializeData(): void {
    this.loading = true;
    combineLatest([this.eventService.getAll(), this.holidayService.getAll()])
    .pipe(take(1)).subscribe(([events, holidays]) => {            
      this.events = events;
      this.holidays = holidays;
      this.loading = false;
    })
  }

  /**
   * bind holiday by month current
   *
   * @param {{ body: CalendarMonthViewDay[] }} { body }
   * @memberof CalendarComponent
   */
  public beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day: CalendarMonthViewDay) => {
      this.holidays.forEach((holiday: Holiday) => {
        if (day.date >= holiday.start_date && day.date <= holiday.end_date) day.cssClass = 'holiday';
      });
    });
  }

  public eventTimesChanged(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    this.events = this.eventService.eventTimesChanged(calendarEventTimesChangedEvent);
  }
}
