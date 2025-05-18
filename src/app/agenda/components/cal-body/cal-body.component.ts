import { EventService } from '@agenda/services/event.service';
import { Holiday, HolidayService } from '@agenda/services/holiday.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { isSameDay } from 'date-fns';
import { combineLatest, take, takeUntil } from 'rxjs';
import { CalEventEntity } from '../../models/calEvent.model';
import { DayClickedService } from '../../services/day-clicked.service';
import { MapperService } from '../../services/mapper.service';
import { PublicHoliday, PublicHolidayService } from '@agenda/services/public-holiday.service';

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
  public holidays: Holiday[] = [];
  private publicHolidays: PublicHoliday[] = [];
  public loading = false;
  public activeDayIsOpen: boolean = true;

  constructor(
    private eventService: EventService,
    private holidayService: HolidayService,
    private dayService: DayClickedService,
    private destroy$: DestroyService,
    private mapper: MapperService,
    private publicHolidayService: PublicHolidayService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewDate']) this.initializeData();
    //this.activeDayIsOpen = isSameMonth(new Date(), this.viewDate) ? true : false;
  }

  private initializeData(): void {
    this.loading = true;
    combineLatest([
      this.eventService.getAll().pipe(takeUntil(this.destroy$)),
      this.holidayService.getByYear(this.viewDate).pipe(take(1)),
      this.publicHolidayService.getByYear(this.viewDate).pipe(take(1))
    ]).subscribe(([events, holidays, publicHolidays]) => {
      this.events = this.mapper.entitiesToDTOs(events as CalEventEntity[]);
      this.holidays = holidays;
      this.publicHolidays = publicHolidays;
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
        };
      });

      this.publicHolidays.forEach((publicHoliday: PublicHoliday) => {
        if (isSameDay(day.date, publicHoliday.date)) {
          day.cssClass = 'public-holiday'
          day.meta = {
            ...day.meta,
            publicEvent: publicHoliday.localName
          };
        };
      });
    });
  }

  public eventTimesChanged(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    this.events = this.eventService.eventTimesChanged(calendarEventTimesChangedEvent);
  }
}
