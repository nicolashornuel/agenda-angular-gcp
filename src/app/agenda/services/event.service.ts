import { Injectable } from '@angular/core';
import { collectionData, query, where } from '@angular/fire/firestore';
import { FirestoreService } from '@core/services/firestore.service';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { concatMap, from, Observable, switchMap, tap } from 'rxjs';
import { CalEventEntity } from '../models/calEvent.model';

@Injectable({
  providedIn: 'root'
})
export class EventService extends FirestoreService<CalEventEntity> {
  private events: CalendarEvent[] = [];

  constructor() {
    super('calendarEvent');
  }

  public deleteByYear(year: Date): void {
    this.getByYear(year).pipe(
      switchMap(events => from(events).pipe(concatMap(event => from(this.delete(event.id! as string)))))
    );
  }

  public getByYear(year: Date): Observable<CalEventEntity[]> {
    const currentYear = year.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // 1er janvier à minuit
    const endOfYear = new Date(currentYear + 1, 0, 1); // 1er janvier de l'année suivante
    const q = query(this.collectionRef, where('meta.start', '>=', startOfYear), where('meta.start', '<', endOfYear));
    return collectionData(q, { idField: 'id' });
  }

  public eventTimesChanged({ event, newStart, allDay }: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }
}
