import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaintDuJourService {

  private readonly MOCK_JSON_PATH: string = './assets/saintDuJour.json';
  private saintDuJour: any;

  constructor(private http: HttpClient) { }

  private getJSON(): Observable<any> {
    return this.http.get(this.MOCK_JSON_PATH);
  }

  private getMonth(month: number): any {
    if (month === 1)
      return this.saintDuJour.january;
    if (month === 2)
      return this.saintDuJour.february;
    if (month === 3)
      return this.saintDuJour.march;
    if (month === 4)
      return this.saintDuJour.april;
    if (month === 5)
      return this.saintDuJour.may;
    if (month === 6)
      return this.saintDuJour.june;
    if (month === 7)
      return this.saintDuJour.july;
    if (month === 8)
      return this.saintDuJour.august;
    if (month === 9)
      return this.saintDuJour.september;
    if (month === 10)
      return this.saintDuJour.october;
    if (month === 11)
      return this.saintDuJour.november;
    if (month === 12)
      return this.saintDuJour.december;
  }

  private getEphemeris(day: number, month: number): string {
      const prefix = this.getMonth(month)[day - 1][1];
      return (prefix === '') ?
      this.getMonth(month)[day - 1][0]:
      prefix + ' ' + this.getMonth(month)[day - 1][0];
  }

  public async getWithDate(date: Date): Promise<string> {
    this.saintDuJour = await firstValueFrom(this.getJSON());
    return this.getEphemeris(date.getDate(), date.getMonth() + 1);
  }

}
