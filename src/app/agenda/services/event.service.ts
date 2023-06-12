import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference, Firestore, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalEventEntity } from '../models/calEvent.model';

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

  public eventTimesChanged({ event, newStart, allDay }: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }

  public getAll(): Observable<DocumentData[]> {
    return collectionData(this.collectionRef, { idField: 'id' });
  }

  public async save(document: CalEventEntity): Promise<string> {
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef)
    await setDoc(docRef, { ...document });
    return docRef.id;
  }

  public async update(document: CalEventEntity, id: string): Promise<void> {
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef, id)
    await setDoc(docRef, { ...document });
  }

  public delete(id: string): Promise<void> {
    const docRef: DocumentReference<DocumentData> = doc(this.collectionRef, id);
    return deleteDoc(docRef);
  }
}
