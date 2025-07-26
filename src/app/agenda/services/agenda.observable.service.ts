import { Injectable } from '@angular/core';
import { BehaviorSubjectService, SubjectService } from '@shared/abstracts/observable.abstract';

@Injectable({
  providedIn: 'root'
})
export class CalRecurringEventType$ extends BehaviorSubjectService<any> {
  constructor() {
    super(undefined);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalRecurringEvent$ extends BehaviorSubjectService<any> {
  constructor() {
    super(undefined);
  }
}
@Injectable({
  providedIn: 'root'
})
export class AgendaUser$ extends BehaviorSubjectService<any> {
  constructor() {
    super(undefined);
  }
}

@Injectable({
  providedIn: 'root'
})
export class DayClickedService extends SubjectService<Date> {}

