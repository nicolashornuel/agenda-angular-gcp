import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {addDays, addHours, isSameDay, setDay, startOfDay, subDays, subSeconds} from 'date-fns';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent {
  @Input() view: CalendarView = CalendarView.Week;

  @Input() viewDate: Date = new Date();
  public CalendarView = CalendarView;
  public activeDayIsOpen = false;

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      //color: colors.blue,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: addHours(startOfDay(setDay(new Date(), 3)), 2),
      end: subSeconds(addHours(startOfDay(setDay(new Date(), 3)), 3), 1),
      title: 'An short event',
      //color: colors.yellow,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: addHours(startOfDay(setDay(new Date(), 3)), 5),
      end: subSeconds(addHours(startOfDay(setDay(new Date(), 3)), 10), 1),
      title: 'A draggable and resizable event',
      //color: colors.yellow,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  refresh = new Subject<void>();

  constructor(private eventService: EventService) {}

  public validateEventTimesChanged = (
    {event, newStart, newEnd, allDay}: CalendarEventTimesChangedEvent,
    addCssClass = true
  ) => {
    if (event.allDay) {
      return true;
    }

    delete event.cssClass;
    // don't allow dragging or resizing events to different days
    const sameDay = isSameDay(newStart, newEnd!);

    if (!sameDay) {
      return false;
    }

    // don't allow dragging events to the same times as other events
    const overlappingEvent = this.events.find(otherEvent => {
      return (
        otherEvent !== event &&
        !otherEvent.allDay &&
        ((otherEvent.start < newStart && newStart < otherEvent.end!) ||
          (otherEvent.start < newEnd! && newStart < otherEvent.end!))
      );
    });

    if (overlappingEvent) {
      if (addCssClass) {
        event.cssClass = 'invalid-position';
      } else {
        return false;
      }
    }

    return true;
  };

  public eventTimesChanged(eventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    delete eventTimesChangedEvent.event.cssClass;
    if (this.validateEventTimesChanged(eventTimesChangedEvent, false)) {
      const {event, newStart, newEnd} = eventTimesChangedEvent;
      event.start = newStart;
      event.end = newEnd;
      this.refresh.next();
    }
  }

  public eventDropped({event, newStart, newEnd, allDay}: CalendarEventTimesChangedEvent): void {

    this.eventService

  }
}
