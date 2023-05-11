import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { isSameDay } from 'date-fns';
import { combineLatest, take, takeUntil } from 'rxjs';
import { EventService } from 'src/app/core/services/event.service';
import { Holiday, HolidayService } from 'src/app/core/services/holiday.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';
import { DayClickedService } from '../../services/day-clicked.service';

export const collapseAnimation: AnimationTriggerMetadata = trigger('collapse', [
  state('open', style({
      height: 0
    })
  ),
  state('close', style({
      height: '*'
    })
  ),
  transition('open => closed', animate('150ms ease-out')),
  transition('closed => open', animate('150ms ease-in')),
]);

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [collapseAnimation]
})
export class CalendarComponent implements OnInit {
  @Input() view!: CalendarView;
  @Input() viewDate!: Date;
  @Input() isLocked!: boolean;
  public events: CalendarEvent[] = [];
  private holidays: Holiday[] = [];
  public loading = false;
  public activeDayIsOpen: boolean = false;

  constructor( private eventService: EventService, private holidayService: HolidayService, private dayService: DayClickedService, private destroy$: DestroyService) { }

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
    this.dayService.getDayClicked$.pipe(takeUntil(this.destroy$)).subscribe( (date: Date | null) => {
      if (date) {
        if (!isSameDay(this.viewDate, date)) this.viewDate = date;
        this.activeDayIsOpen = true;
      } else {
        this.activeDayIsOpen = false;
      }
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
