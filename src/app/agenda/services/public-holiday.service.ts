import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { map, Observable } from 'rxjs';

export interface PublicHoliday {
  date: Date;
  localName: string;
}

export class PublicHoliday {
  constructor(item: { date: string; localName: string }) {
    this.date = new Date(item.date);
    this.localName = item.localName;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PublicHolidayService {
  private readonly publicHolidayApi = environment.publicHolidayApi;
  private readonly countryCode = 'FR';

  constructor(private http: HttpClient) {}

  public getByYear(date: Date): Observable<PublicHoliday[]> {
    return this.http
      .get<{ date: string; localName: string }[]>(`${this.publicHolidayApi}/${date.getFullYear()}/${this.countryCode}`)
      .pipe(map(list => list.map(item => new PublicHoliday(item))));
  }
}
