import {Injectable} from '@angular/core';
import {BehaviorSubjectService} from '@shared/abstracts/observable.abstract';

@Injectable({
  providedIn: 'root'
})
export class AudioGainService extends BehaviorSubjectService<number> {
  constructor() {
    super(0.03);
  }
}
