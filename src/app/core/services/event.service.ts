import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference, Firestore, Timestamp, collection, collectionChanges, collectionData, deleteDoc, doc, docSnapshots, setDoc } from '@angular/fire/firestore';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: CalendarEvent[] = [];

  private readonly events$ = new BehaviorSubject<CalendarEvent[]>([]);

  private collectionRef!: CollectionReference<DocumentData>;

  // https://github.com/angular/angularfire/blob/master/docs/version-7-upgrade.md
  // https://github.com/javebratt/angularfire-idField/blob/main/src/app/home/home.page.ts

  constructor(private firestore: Firestore) {
    this.collectionRef = collection(this.firestore, 'calendarEvent');
  }

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

  public eventTimesChanged({ event, newStart, allDay }: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }

  public getAll(): Observable<CalendarEvent[]> {
    return collectionData(this.collectionRef, {idField: 'id'})
    .pipe(map(events => this.toDTO(events)));
  }

  private toDTO(events: DocumentData[]): CalendarEvent[] {
    return events.map(event => {
      const newEvent = { ...event }
      newEvent['start'] = event['start'].toDate();
      newEvent['end'] = event['end'] ? event['end'].toDate() : undefined;
      return newEvent as CalendarEvent;
    });
  }

  public async save(document: DocumentData): Promise<string> {
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef)
    await setDoc(docRef, { ...document });
    return docRef.id;
  }

  public delete(id: string): Promise<void> {
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef, id);
    return deleteDoc(docRef);
  }
}
