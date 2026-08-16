import { Injectable } from '@angular/core';
import { BehaviorSubjectService, SubjectService } from '@shared/abstracts/observable.abstract';


@Injectable()
export class AgendaUserSercice extends BehaviorSubjectService<any> {
  constructor() {
    super(undefined);
  }
}

@Injectable()
export class DayClickedService extends SubjectService<Date> {}

