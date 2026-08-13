import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AlertService } from '@shared/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alert: AlertService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, request);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<unknown>): void {

    const url = new URL(request.url);
    const domain = url.hostname;

    // 1. Blob
    if (error.error instanceof Blob) {
      error.error.text().then(text => {
        try {
          const json = JSON.parse(text);

          console.log('blob', json)
          this.alert.error(`${domain} : ${json.error || json.message || 'Erreur serveur'}`);
        } catch {
          this.alert.error(`${domain} : Erreur serveur`);
        }
      });

      return;
    }

    // 2. JSON
    if (error.error && typeof error.error === 'object') {
      this.alert.error(`${domain} : ${error.error.error.message || 'Erreur serveur'}`);

      return;
    }

    // 3. Texte
    if (typeof error.error === 'string') {
      console.log('string', error)
      this.alert.error(`${domain} : ${error.error}`);
      return;
    }

    // 4. Erreur réseau
    if (error.status === 0) {
      this.alert.error(`${domain} : Impossible de contacter le serveur.`);
      return;
    }

    // 5. Fallback
    this.alert.error(`${domain} : ${error.message || 'Une erreur est survenue.'}`);
  }
}
