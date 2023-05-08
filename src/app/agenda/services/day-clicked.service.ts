import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DayClickedService {

  private readonly dayClicked$ = new Subject<Date | null>();

  constructor() { }

  public get getDayClicked$(): Observable<any> {
    return this.dayClicked$.asObservable();
  }

  public setDayClicked$(date: Date | null) {
    this.dayClicked$.next(date);
  }
}
