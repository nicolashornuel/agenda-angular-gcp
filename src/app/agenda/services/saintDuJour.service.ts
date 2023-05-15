import { Injectable } from '@angular/core';
import { saintDuJour } from '../models/saintDuJour.constant';

@Injectable({
  providedIn: 'root'
})
export class SaintDuJourService {

  constructor() { }

  private getMonth(month: number): any {
    if (month === 1)
      return saintDuJour.january;
    if (month === 2)
      return saintDuJour.february;
    if (month === 3)
      return saintDuJour.march;
    if (month === 4)
      return saintDuJour.april;
    if (month === 5)
      return saintDuJour.may;
    if (month === 6)
      return saintDuJour.june;
    if (month === 7)
      return saintDuJour.july;
    if (month === 8)
      return saintDuJour.august;
    if (month === 9)
      return saintDuJour.september;
    if (month === 10)
      return saintDuJour.october;
    if (month === 11)
      return saintDuJour.november;
    if (month === 12)
      return saintDuJour.december;
  }

  private getEphemeris(day: number, month: number): string {
      const prefix = this.getMonth(month)[day - 1][1];
      return (prefix === '') ?
      this.getMonth(month)[day - 1][0]:
      prefix + ' ' + this.getMonth(month)[day - 1][0];
  }

  public getWithDate(date: Date): string {
    return this.getEphemeris(date.getDate(), date.getMonth() + 1);
  }

}
