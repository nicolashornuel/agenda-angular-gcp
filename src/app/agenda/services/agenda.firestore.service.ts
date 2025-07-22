import { AgendaUser, AgendaUserGroup, CalRecurringEvent, CalRecurringEventType } from '@agenda/models/calEvent.model';
import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  DocumentReference,
  getDoc,
  setDoc
} from '@angular/fire/firestore';
import { FirestoreService } from '@core/services/firestore.service';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';

const CAL_RECURRING_EVENT_TYPE = 'calRecurringEventType';
const CAL_RECURRING_EVENT = 'calRecurringEvent';
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
export class CalRecurringEventTypeService extends FirestoreService<CalRecurringEventType> {
  constructor() {
    super(CAL_RECURRING_EVENT_TYPE);
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
      order: calRecurringEvent.order
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
