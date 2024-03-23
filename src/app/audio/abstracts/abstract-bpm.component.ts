import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DestroyService } from '@shared/services/destroy.service';
import { BpmService } from '../services/bpm.service';

@Component({ template: '' })
export abstract class AbstractBpmComponent implements OnInit {
  protected duration!: number;
  protected current!: number;
  public modulationTypes: string[] = ['none', 'filter'];


  private modulation$: BehaviorSubject<number> = new BehaviorSubject<number>(100);

  constructor(protected destroy$: DestroyService, private bpmService: BpmService) {}

  ngOnInit(): void {
    this.subscribeBpm();
  }

  private subscribeBpm(): void {
    this.bpmService.getCurrent$.pipe(takeUntil(this.destroy$)).subscribe(current => (this.current = current));
    this.bpmService.getDuration$.pipe(takeUntil(this.destroy$)).subscribe(duration => (this.duration = duration));
  }

  protected get getCurrent$(): Observable<number> {
    return this.bpmService.getCurrent$.pipe(takeUntil(this.destroy$));
  }

  public setModulation$(value: number): void {
    this.modulation$.next(1000 - value);
  }

  public get getModulation$(): Observable<number> {
    return this.modulation$.asObservable().pipe(
      switchMap(modulation => interval(modulation)),
      takeUntil(this.destroy$)
    );
  }

}
