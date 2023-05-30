import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alert } from '../models/alert.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert>();

  constructor() { }

  /**
   * get observable
   *
   * @readonly
   * @type {Observable<Alert>}
   * @memberof AlertService
   */
  public get getAlerts$(): Observable<Alert> {
    return this.subject.asObservable();
  }

  /**
   * set observable
   *
   * @private
   * @param {Alert} alert
   * @memberof AlertService
   */
  private setAlert$(alert: Alert): void {
    this.subject.next(alert);

  }

    /**
     * CALL success alert
     *
     * @param {string} content
     * @memberof AlertService
     */
    public success(content: string): void {
      const alert: Alert = { title: 'Success', content, styleCSS: 'alert-success' };
      this.setAlert$(alert);
    }
  

    /**
     * CALL error alert
     *
     * @param {string} content
     * @memberof AlertService
     */
    public error(content: string): void {
      const alert: Alert = { title: 'Error', content, styleCSS: 'alert-error' };
      this.setAlert$(alert);
    }
  

    /**
     * CALL warning alert
     *
     * @param {string} content
     * @memberof AlertService
     */
    public warning(content: string): void {
      const alert: Alert = { title: 'Warning', content, styleCSS: 'alert-warning' };
      this.setAlert$(alert);    }
  

    /**
     * CALL info alert
     *
     * @param {string} content
     * @memberof AlertService
     */
    public info(content: string): void {
      const alert: Alert = { title: 'Info', content, styleCSS: 'alert-info' };
      this.setAlert$(alert);    }
}
