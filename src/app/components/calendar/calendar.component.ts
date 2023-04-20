import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent {
  @Input() view: CalendarView = CalendarView.Month;
  @Input() viewDate: Date = new Date();
  public events: CalendarEvent[] = [];
  public refresh = new Subject<void>();

  constructor(private eventService: EventService) {}

  public eventTimesChanged(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent): void {  
    this.events = this.eventService.eventTimesChanged(calendarEventTimesChangedEvent)
  }

}
