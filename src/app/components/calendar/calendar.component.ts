import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {Subject, takeUntil} from 'rxjs';
import {DestroyService} from 'src/app/services/destroy.service';
import {EventService} from 'src/app/services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  @Input() view: CalendarView = CalendarView.Month;
  @Input() viewDate: Date = new Date();
  public events: CalendarEvent[] = [];
  public refresh = new Subject<void>();

  constructor(private eventService: EventService, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.eventService.getEvents$
    .pipe(takeUntil(this.destroy$))
    .subscribe((calendarEvents: CalendarEvent[]) => this.events = calendarEvents);
  }

  public eventTimesChanged(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    this.events = this.eventService.eventTimesChanged(calendarEventTimesChangedEvent);
  }
}
