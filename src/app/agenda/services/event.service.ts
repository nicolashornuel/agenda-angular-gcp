import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { getFunctions, httpsCallable, connectFunctionsEmulator, Functions } from "firebase/functions";
import { BehaviorSubject } from 'rxjs';
import { CalEventEntity } from '@models/calEvent.model';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: CalendarEvent[] = [];

  private readonly events$ = new BehaviorSubject<CalendarEvent[]>([]);

  private functions: Functions;

  constructor() {
    this.functions = getFunctions();
    //connectFunctionsEmulator(this.functions, "127.0.0.1", 5001);
  }

  public eventTimesChanged({ event, newStart, allDay }: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }
  public async getAll(): Promise<any> {
    const onCallFunction = httpsCallable(this.functions, 'onCallGetAllEvent');
    return onCallFunction();
  }
  public async save(document: CalEventEntity): Promise<string> {
    const onCallFunction = httpsCallable(this.functions, 'onCallCreateOneEvent');
    return onCallFunction(document) as unknown as string;
  }
  public async update(document: CalEventEntity, id: string): Promise<void> {
    const onCallFunction = httpsCallable(this.functions, 'onCallUpdateOneEvent');
    return onCallFunction({ id, document }) as unknown as void;
  }
  public async delete(id: string): Promise<void> {
    const onCallFunction = httpsCallable(this.functions, 'onCallDeleteOneEvent');
    return onCallFunction(id) as unknown as void;
  }
}
