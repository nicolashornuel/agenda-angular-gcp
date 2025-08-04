import {
  AgendaUser,
  AgendaUserGroup,
  CalendarBirthday,
  CalendarCheckbox,
  CalendarConfirmed,
  CalEventTypeEnum,
  CalRecurringEventRule
} from '@agenda/models/calEvent.model';
import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
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
import { concatMap, from, map, Observable, switchMap } from 'rxjs';

const CALENDAR_BIRTHDAY = 'calendarBirthday';
const CALENDAR_CHECKBOX = 'calendarCheckbox';
const CALENDAR_EVENT = 'calendarEvent';
const AGENDA_USER = 'agendaUser';
const AGENDA_USER_GROUP = 'agendaUserGroup';

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
export class CalendarBirthdayService extends FirestoreService<CalendarBirthday> {
  constructor() {
    super(CALENDAR_BIRTHDAY);
  }

  public getByMonth(date: Date): Observable<CalendarBirthday[]> {
    const month = date.getMonth() + 1;
    return this.getByQuery(
      { fieldPath: CalendarBirthday.MONTH.key },
      { key: CalendarBirthday.MONTH.key, value: month }
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalendarConfirmedService extends FirestoreService<CalendarConfirmed> {
  //CalEventEntity
  private readonly calRecurringEventCollection = collection(this.firestore, CALENDAR_CHECKBOX);

  private events: CalendarEvent[] = [];

  constructor() {
    super(CALENDAR_EVENT);
  }

  public async saveLikeComment(comment: CalendarEvent<Partial<{ type: CalEventTypeEnum }>>): Promise<void> {
    const entity: CalendarConfirmed = {
        start: Timestamp.fromDate(comment.start),
  type: CalEventTypeEnum.COMMENT,
      title: comment.title
    };
    await this.update(entity, comment.id as string);
  }

  public deleteByMonth(date: Date): Observable<void> {
    return this.getByMonth(date).pipe(
      switchMap(events => from(events).pipe(concatMap(event => from(this.delete(event.id! as string)))))
    );
  }

  public async confirmRecurringEvent(recurringEventId: string, date: Date): Promise<string> {
    const entity: CalendarConfirmed = {
      recurringEventId,
      type: CalEventTypeEnum.FAMILY,
      start: Timestamp.fromDate(new Date(date.toDateString()))
    };
    const { id } = await addDoc(this.collectionRef, entity);
    return id;
  }

  public getByMonth(date: Date): Observable<CalendarEvent[]> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const q = query(this.collectionRef, where('start', '>=', start), where('start', '<', end));
    return collectionData(q, { idField: 'id' }).pipe(
      map(events =>
        events.map(event => ({
          id: event.id,
          title: '',
          start: event.start.toDate(),
          meta: {
            recurringEventId: event.recurringEventId,
            type: event.type,
            start: event.start
          }
        }))
      )
    );
  }

  public eventTimesChanged({ event, newStart, allDay }: CalendarEventTimesChangedEvent): CalendarEvent[] {
    if (typeof allDay !== 'undefined') event.allDay = allDay;
    event.start = newStart;
    this.events.push(event);
    this.events = [...this.events];
    return this.events;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalendarCheckboxService extends FirestoreService<CalendarCheckbox> {
  constructor() {
    super(CALENDAR_CHECKBOX);
  }

  public getAllWithRecordRules(): Observable<CalendarCheckbox[]> {
    return super.getByQuery({ fieldPath: 'order' });
  }

  public getList(): Observable<CalendarCheckbox[]> {
    return super.getByQuery({ fieldPath: 'order' }).pipe(
      map(checks =>
        checks.map(check => ({
          ...check,
          rules: CalRecurringEventRule.toArray(check.rules as Record<string, boolean[]>)
        }))
      )
    );
  }

  public override async saveOrUpdate(calendarCheckbox: CalendarCheckbox): Promise<void> {
    await super.saveOrUpdate({
      ...calendarCheckbox,
      rules: CalRecurringEventRule.toRecord(calendarCheckbox.rules as CalRecurringEventRule[])
    } as Identifiable);
  }
}


