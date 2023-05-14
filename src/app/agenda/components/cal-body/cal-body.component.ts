import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { EventService } from 'src/app/agenda/services/event.service';
import { Holiday, HolidayService } from 'src/app/agenda/services/holiday.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { CalEventEntity } from '../../models/calEvent.model';
import { DayClickedService } from '../../services/day-clicked.service';
import { MapperService } from '../../services/mapper.service';

@Component({
  selector: 'app-cal-body',
  templateUrl: './cal-body.component.html',
  styleUrls: ['./cal-body.component.scss']
})
export class CalBodyComponent implements OnInit, OnChanges {
  @Input() view!: CalendarView;
  @Input() viewDate!: Date;
  @Input() isLocked!: boolean;
  public events: CalendarEvent[] = [];
  private holidays: Holiday[] = [];
  public loading = false;
  public activeDayIsOpen: boolean = true;
  public refresh = new Subject<void>();

  constructor(
    private eventService: EventService,
    private holidayService: HolidayService,
    private dayService: DayClickedService,
    private destroy$: DestroyService,
    private mapper: MapperService
    ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(_changes: SimpleChanges): void {
     this.activeDayIsOpen = isSameMonth(new Date(), this.viewDate) ? true : false;
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
      .pipe(takeUntil(this.destroy$)).subscribe(([events, holidays]) => {
        this.events = this.mapper.entitiesToDTOs(events as CalEventEntity[]);
        this.holidays = holidays;
        this.loading = false;
      })
    this.dayService.getDayClicked$.pipe(takeUntil(this.destroy$)).subscribe((date: Date | null) => {
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
        if (day.date >= holiday.start && day.date <= holiday.end) day.cssClass = 'holiday';
      });
    });
  }

  public eventTimesChanged(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    this.events = this.eventService.eventTimesChanged(calendarEventTimesChangedEvent);
  }

}
