import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';

export abstract class SubjectService<T> {
  private subject$ = new Subject<T | null | undefined>();

  public get get$(): Observable<T | null | undefined> {
    return this.subject$.asObservable();
  }

  public set$(value: T | null | undefined): void {
    this.subject$.next(value);
  }
}

export abstract class BehaviorSubjectService<T> {
  private behaviorSubject$: BehaviorSubject<T>;

  constructor(initialValue: T) {
    this.behaviorSubject$ = new BehaviorSubject<T>(initialValue);
  }

  public get get$(): Observable<T> {
    return this.behaviorSubject$.asObservable();
  }

  public set$(newValue: T): void {
    this.behaviorSubject$.next(newValue);
  }

  public get value(): T {
    return this.behaviorSubject$.value;
  }
}

export abstract class ObservableService<T> {
  private subject$ = new ReplaySubject<T>(1);

  public get get$(): Observable<T> {
    return this.subject$.asObservable();
  }

  public set$(value: T): void {
    this.subject$.next(value);
  }
}
