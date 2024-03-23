import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainGainService {

  private mainGainValue$: BehaviorSubject<number> = new BehaviorSubject<number>(0.03);

  constructor() { }

  public get getMainGainValue$(): Observable<number> {
    return this.mainGainValue$.asObservable();
  }

  public setMainGainValue$(value: number): void {
    this.mainGainValue$.next(value);
  }

}
