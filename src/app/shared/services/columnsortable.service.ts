import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ColSorted {
  colKey: string,
  direction: 'up' | 'down',
}
@Injectable({
  providedIn: 'root'
})
export class ColumnsortableService {

  private readonly columnSort$ = new BehaviorSubject<ColSorted | undefined>(undefined);

  constructor() { }

  public get getColumnSort$(): Observable<ColSorted | undefined> {
    return this.columnSort$.asObservable();
  }

  public setColumnSort$(value: ColSorted): void {
    this.columnSort$.next(value);
  }

}
