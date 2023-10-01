import { CalEventField, CalEventType } from '@agenda/models/calEvent.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { AbstractHttpService } from 'app/core/services/abstractHttp.service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends AbstractHttpService<CalendarEvent> {
  
  private events: CalendarEvent[] = [];

  constructor(http: HttpClient) {
    super(http, 'calendarEvent')
   }

  public eventTimesChanged({ event, newStart, allDay }: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }

  public commentToEntity(value: string, date: Date): CalendarEvent {
    return {
      title: value,
      start: date,
      meta: {
        type: CalEventType.COMMENT,
      }
    };
  }

  public fieldToEntity(field: CalEventField, date: Date): CalendarEvent {
    console.log(date);
    console.log(field.meta?.start);
    return {
      title: field.title!,
      start: new Date(date.toDateString() + ' ' + field.meta!.start),
      end: field.meta!.end ? new Date(date.toDateString() + ' ' + field.meta!.end) : undefined,
      meta: {
        type: field.meta!.type!
      },
    };
  }
  
}
