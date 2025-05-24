import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AlertService } from '@shared/services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alert: AlertService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status && error.error instanceof Blob) {
          error.error.text().then((text: string) => {
            const json = JSON.parse(text);
            this.alert.error(json.error || 'Erreur serveur');
          });
        }
        return throwError(() => error);
      })
    );
  }
}
