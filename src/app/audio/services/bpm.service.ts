import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BpmService {
  private bpm$: BehaviorSubject<number> = new BehaviorSubject<number>(150);
  private duration$: BehaviorSubject<number> = new BehaviorSubject<number>(100);
  private current$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {}

  public setBpm$(value: number): void {
    this.bpm$.next(value);
  }

  public get getBpm$(): Observable<number> {
    return this.bpm$.asObservable();
  }

  public setDuration$(value: number): void {
    this.duration$.next(value);
  }

  public get getDuration$(): Observable<number> {
    return this.duration$.asObservable();
  }

  public setCurrent$(value: number): void {
    this.current$.next(value);
  }

  public get getCurrent$(): Observable<number> {
    return this.current$.asObservable();
  }
}
