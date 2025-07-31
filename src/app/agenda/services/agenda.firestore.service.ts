import {
  AgendaUser,
  AgendaUserGroup,
  CalBirthday,
  CalCheckboxEvent,
  CalendarCheckboxEvent,
  CalEventEntity,
  CalRecurringEvent,
  CalRecurringEventRule,
  CalRecurringEventType
} from '@agenda/models/calEvent.model';
import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  DocumentReference,
  getDoc,
  query,
  setDoc,
  Timestamp,
  where
} from '@angular/fire/firestore';
import { FirestoreService } from '@core/services/firestore.service';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Identifiable } from 'app/train/models/reservation.model';
import { isAfter } from 'date-fns';
import { combineLatest, concatMap, from, map, Observable, of, switchMap, tap } from 'rxjs';

const CAL_RECURRING_EVENT_TYPE = 'calRecurringEventType';
const CAL_RECURRING_EVENT = 'calRecurringEvent';
const AGENDA_USER = 'agendaUser';
const AGENDA_USER_GROUP = 'agendaUserGroup';
const CAL_BIRTHDAY = 'calBirthday';
const CAL_EVENT = 'calendarEvent';
const CALENDAR_CHECKBOX_EVENT = 'calendarCheckboxEvent';

@Injectable({
  providedIn: 'root'
})
export class AgendaUserGroupService extends FirestoreService<AgendaUserGroup> {
  constructor() {
    super(AGENDA_USER_GROUP);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AgendaUserService extends FirestoreService<AgendaUser> {
  private readonly agendaUserGroupCollection = collection(this.firestore, AGENDA_USER_GROUP);

  constructor() {
    super(AGENDA_USER);
  }

  public async addDoc(agendaUser: AgendaUser) {
    const agendaUserGroupRef = doc(this.agendaUserGroupCollection, agendaUser.agendaUserGroup.id);
    const entity = { name: agendaUser.name, agendaUserGroup: agendaUserGroupRef };
    const agendaUserRef = (await addDoc(this.collectionRef, entity)) as DocumentReference<AgendaUser>;
    const agendaUserGroupSnap = await getDoc(agendaUserGroupRef);
    const agendaUserGroup = agendaUserGroupSnap.data() as AgendaUserGroup;
    if (!agendaUserGroup.agendaUser) agendaUserGroup.agendaUser = [];
    agendaUserGroup.agendaUser.push(agendaUserRef);
    return setDoc(agendaUserGroupRef, agendaUserGroup);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalRecurringEventTypeService extends FirestoreService<CalRecurringEventType> {
  constructor() {
    super(CAL_RECURRING_EVENT_TYPE);
  }

  public override getAll(): Observable<CalRecurringEventType[]> {
    return super.getAll().pipe(
      map(types =>
        types.map(type => ({
          ...type,
          rules: CalRecurringEventRule.toArray(type.rules as Record<string, boolean[]>)
        }))
      )
    );
  }

  public override async saveOrUpdate(calRecurringEventType: CalRecurringEventType): Promise<void> {
    await super.saveOrUpdate({
      ...calRecurringEventType,
      rules: CalRecurringEventRule.toRecord(calRecurringEventType.rules as CalRecurringEventRule[])
    } as CalRecurringEventType);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalRecurringEventService extends FirestoreService<CalRecurringEvent> {
  private readonly agendaUserCollection = collection(this.firestore, AGENDA_USER);
  private readonly calRecurringEventTypeCollection = collection(this.firestore, CAL_RECURRING_EVENT_TYPE);

  constructor() {
    super(CAL_RECURRING_EVENT);
  }

  public getDocs$(): Observable<CalRecurringEvent[]> {
    return collectionData(this.collectionRef, { idField: 'id' }).pipe(
      switchMap((events: any[]) => {
        if (!events.length) return of([]); // Aucun événement

        const eventObservables = events.map(event => {
          const calRecurringEvent = event as CalRecurringEvent;

          const calRecurringEventType$ = docData(
            calRecurringEvent.calRecurringEventType as DocumentReference<CalRecurringEventType>,
            { idField: 'id' }
          ).pipe(map(data => data || ({} as CalRecurringEventType)));

          const agendaUser$ = docData(calRecurringEvent.agendaUser as DocumentReference<AgendaUser>, {
            idField: 'id'
          }).pipe(map(data => data || ({} as AgendaUser)));

          // On combine les 2 sous-documents
          return combineLatest([agendaUser$, calRecurringEventType$]).pipe(
            map(([agendaUser, calRecurringEventType]) => ({
              ...calRecurringEvent,
              agendaUser,
              calRecurringEventType
            }))
          );
        });

        // Combine tous les observables en un seul tableau
        return combineLatest(eventObservables);
      })
    );
  }

  public override async saveOrUpdate(calRecurringEvent: CalRecurringEvent): Promise<void> {
    const calRecurringEventTypeRef = doc(
      this.calRecurringEventTypeCollection,
      calRecurringEvent.calRecurringEventType.id
    );
    const agendaUserRef = doc(this.agendaUserCollection, calRecurringEvent.agendaUser.id);
    const entity = {
      agendaUser: agendaUserRef,
      calRecurringEventType: calRecurringEventTypeRef,
      order: calRecurringEvent.order,
      name: calRecurringEvent.name
    } as CalRecurringEvent;
    calRecurringEvent.id ? await this.update(entity, calRecurringEvent.id) : await this.save(entity);
  }

  public override async update(entity: CalRecurringEvent, id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await setDoc(docRef, entity);
  }

  public override async save(entity: CalRecurringEvent): Promise<string> {
    const docRef = await addDoc(this.collectionRef, entity);
    entity.id = docRef.id;
    return docRef.id;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalBirthdayService extends FirestoreService<CalBirthday> {
  constructor() {
    super(CAL_BIRTHDAY);
  }

  public getByMonth(date: Date): Observable<CalBirthday[]> {
    const month = date.getMonth() + 1;
    return this.getByQuery({ fieldPath: CalBirthday.MONTH.key }, { key: CalBirthday.MONTH.key, value: month });
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalEventService extends FirestoreService<CalEventEntity> {
  private readonly calRecurringEventCollection = collection(this.firestore, CAL_RECURRING_EVENT);

  private events: CalendarEvent[] = [];

  constructor() {
    super(CAL_EVENT);
  }

  public deleteByYear(year: Date): void {
    this.getByYear(year).pipe(
      switchMap(events => from(events).pipe(concatMap(event => from(this.delete(event.id! as string)))))
    );
  }
  public deleteByMonth(date: Date): Observable<void> {
    return this.getByMonth(date).pipe(
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

  public getByMonth(date: Date): Observable<CalEventEntity[]> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const q = query(this.collectionRef, where('meta.start', '>=', start), where('meta.start', '<', end));
    return collectionData(q, { idField: 'id' });
  }

  public eventTimesChanged({ event, newStart, allDay }: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }

  public async add(calEvent: CalCheckboxEvent, date: Date): Promise<string> {
    const calRecurringEventRef = doc(this.calRecurringEventCollection, calEvent.meta!.calRecurringEventId);
    const entity = {
      title: calEvent.title,
      meta: {
        recurringEvent: calRecurringEventRef,
        type: calEvent.meta!.type!,
        start: Timestamp.fromDate(new Date(date.toDateString() + ' ' + calEvent.meta!.start)),
        end: Timestamp.fromDate(new Date(date.toDateString() + ' ' + calEvent.meta!.end))
      }
    } as CalEventEntity;
    const { id } = await addDoc(this.collectionRef, entity);
    calEvent.id = id;
    return id;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalendarCheckboxEventService extends FirestoreService<CalendarCheckboxEvent> {
  constructor() {
    super(CALENDAR_CHECKBOX_EVENT);
  }

  public getList(): Observable<CalendarCheckboxEvent[]> {
    return super.getByQuery({ fieldPath: 'order'}).pipe(
      map(checks =>
        checks.map(check => ({
          ...check,
          rules: CalRecurringEventRule.toArray(check.rules as Record<string, boolean[]>)
        }))
      )
    );
  }

  public override async saveOrUpdate(calendarCheckboxEvent: CalendarCheckboxEvent): Promise<void> {
    await super.saveOrUpdate({
      ...calendarCheckboxEvent,
      rules: CalRecurringEventRule.toRecord(calendarCheckboxEvent.rules as CalRecurringEventRule[])
    } as Identifiable);
  }
}
