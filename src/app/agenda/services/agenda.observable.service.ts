import { Injectable } from '@angular/core';
import { BehaviorSubjectService } from '@shared/abstracts/observable.abstract';

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