import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SafeObservableService {
  
  public withFallback<T>(request$: Observable<T>, fallback: T, name?: string): Observable<T> {
    return request$.pipe(
      catchError(error => {
        console.error(`Erreur${name ? ` ${name}` : ''}`, error);

        return of(fallback);
      })
    );
  }

  public safe<T>(fallback: T, name?: string): MonoTypeOperatorFunction<T> {
    return catchError(error => {
      console.error(`Erreur${name ? ` ${name}` : ''}`, error);

      return of(fallback);
    });
  }
}
