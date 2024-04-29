import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private source$: Subject<HTMLMediaElement> = new Subject<HTMLMediaElement>();

  constructor() { }

  public get getIsPlaying$(): Observable<boolean> {
    return this.isPlaying$.asObservable();
  }

  public setIsPlaying(isPlaying: boolean): void {
    this.isPlaying$.next(isPlaying);
  }

  public get getSource$(): Observable<HTMLMediaElement> {
    return this.source$.asObservable();
  }

  public setSource$(source: HTMLMediaElement): void {
    this.source$.next(source);
  }

}
