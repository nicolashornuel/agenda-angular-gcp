import { Injectable } from '@angular/core';
import { BehaviorSubjectService } from '@shared/abstracts/observable.abstract';

@Injectable({
  providedIn: 'root'
})
export class RadioPlayingService extends BehaviorSubjectService<boolean> {
  constructor() {
    super(false);
  }
}