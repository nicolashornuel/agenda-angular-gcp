import { CalRecurringEvent, CalRecurringEventType } from '@agenda/models/calEvent.model';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@core/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CalRecurringEventTypeService extends FirestoreService<CalRecurringEventType> {
  constructor() {
    super('calRecurringEventType');
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalRecurringEventService extends FirestoreService<CalRecurringEvent> {
  constructor() {
    super('calRecurringEvent');
  }
}
