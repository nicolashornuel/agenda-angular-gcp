import { Injectable } from '@angular/core';
import { OrderByDirection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ColSorted {
  fieldPath: string,
  directionStr?: OrderByDirection,
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
