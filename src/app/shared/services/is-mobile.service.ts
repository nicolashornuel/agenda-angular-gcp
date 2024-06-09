import { Injectable } from '@angular/core';
import { BehaviorSubjectService } from '@shared/abstracts/observable.abstract';

@Injectable({
  providedIn: 'root'
})
export class IsMobileService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}