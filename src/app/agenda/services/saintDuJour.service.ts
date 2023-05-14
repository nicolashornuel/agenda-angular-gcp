import { Injectable } from '@angular/core';
import { SaintDuJour } from '../models/saintDuJour.constant';

@Injectable({
  providedIn: 'root'
})
export class SaintDuJourService {

  constructor() { }

  private getMonth(month: number): any {
    if (month === 1)
      return SaintDuJour.january;
    if (month === 2)
      return SaintDuJour.february;
    if (month === 3)
      return SaintDuJour.march;
    if (month === 4)
      return SaintDuJour.april;
    if (month === 5)
      return SaintDuJour.may;
    if (month === 6)
      return SaintDuJour.june;
    if (month === 7)
      return SaintDuJour.july;
    if (month === 8)
      return SaintDuJour.august;
    if (month === 9)
      return SaintDuJour.september;
    if (month === 10)
      return SaintDuJour.october;
    if (month === 11)
      return SaintDuJour.november;
    if (month === 12)
      return SaintDuJour.december;
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
