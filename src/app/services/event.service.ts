import { Injectable } from '@angular/core';
import { CalendarEventTimesChangedEvent, CalendarEvent } from 'angular-calendar';
import { BehaviorSubject, Observable } from 'rxjs';
import { HolidayService } from './holiday.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  externalEvents: CalendarEvent[] = [];

  events: CalendarEvent[] = [];

  private readonly events$ = new BehaviorSubject<CalendarEvent[]>([]);
  
  constructor() {}

  public get getEvents$(): Observable<CalendarEvent[]> {
    return this.events$.asObservable();
  }

  public setEvents$(calendarEvents: CalendarEvent[]): void {
    this.events = [...calendarEvents];
    this.events$.next(this.events);
  }

  public pushEvent(calendarEvent: CalendarEvent): void {
    this.events.push(calendarEvent);
    this.events = [...this.events];
    this.events$.next(this.events);
  }

  public eventTimesChanged({event, newStart, allDay}: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }

}
