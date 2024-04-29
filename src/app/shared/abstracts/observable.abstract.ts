import { Observable, Subject } from 'rxjs';

export abstract class ObservableService<T> {
  
  private subject = new Subject<T | null | undefined>();

  public get get$(): Observable<T | null | undefined> {
    return this.subject.asObservable();
  }

  public set$(param: T | null | undefined): void {
    this.subject.next(param);
  }

}