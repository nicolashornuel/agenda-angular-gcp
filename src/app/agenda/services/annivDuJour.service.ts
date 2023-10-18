import { Injectable } from '@angular/core';
import { annivDuJour } from '../../../../models/annivDuJour.constant';

export type AnnivDuJour = {
  day: number,
  title: string,
  year?: number
};


@Injectable({
  providedIn: 'root'
})
export class AnnivDuJourService {

  private getMonth(month: number): AnnivDuJour[] {
    if (month === 1)
      return annivDuJour.january;
    if (month === 2)
      return annivDuJour.february;
    if (month === 3)
      return annivDuJour.march;
    if (month === 4)
      return annivDuJour.april;
    if (month === 5)
      return annivDuJour.may;
    if (month === 6)
      return annivDuJour.june;
    if (month === 7)
      return annivDuJour.july;
    if (month === 8)
      return annivDuJour.august;
    if (month === 9)
      return annivDuJour.september;
    if (month === 10)
      return annivDuJour.october;
    if (month === 11)
      return annivDuJour.november;
    if (month === 12)
      return annivDuJour.december;
    else return [];
  }

  private getAnnivs(day: number, month: number): AnnivDuJour[] {
    return this.getMonth(month).filter((anniv: AnnivDuJour) => anniv.day === day);
  }

  public getWithDate(date: Date): AnnivDuJour[] {
    return this.getAnnivs(date.getDate(), date.getMonth() + 1);
  }

}
