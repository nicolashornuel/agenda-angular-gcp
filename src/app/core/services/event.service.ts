import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference, Firestore, collection, collectionData, doc, docSnapshots, setDoc } from '@angular/fire/firestore';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: CalendarEvent[] = [];

  private readonly events$ = new BehaviorSubject<CalendarEvent[]>([]);
  
  // https://github.com/angular/angularfire/blob/master/docs/version-7-upgrade.md
  constructor(private firestore: Firestore) {}

  public get getEvents$(): Observable<CalendarEvent[]> {
    return this.events$.asObservable();
  }

  public set setEvents$(calendarEvents: CalendarEvent[]) {
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

  public getAll(): Observable<DocumentData[]> {
    const collectionRef: CollectionReference<DocumentData> = collection(this.firestore, 'calendarEvent');
    return collectionData(collectionRef);
  }

  public save(document: DocumentData): Promise<void> {
    const collectionRef: CollectionReference<DocumentData> = collection(this.firestore, 'calendarEvent');
    const docRef: DocumentReference<DocumentData> = doc(collectionRef)
      return setDoc(docRef, {...document});
  }

}