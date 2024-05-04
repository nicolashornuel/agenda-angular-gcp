import { Injectable } from '@angular/core';
import { BehaviorSubjectService, SubjectService } from '@shared/abstracts/observable.abstract';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService extends SubjectService<HTMLMediaElement> {

  private isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get getIsPlaying$(): Observable<boolean> {
    return this.isPlaying$.asObservable();
  }

  public setIsPlaying(isPlaying: boolean): void {
    this.isPlaying$.next(isPlaying);
  }

}

@Injectable({
  providedIn: 'root'
})
export class AudioGainService extends BehaviorSubjectService<number> {
  constructor() {
    super(0.03);
  }
}