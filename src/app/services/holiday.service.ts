import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {map, Observable} from 'rxjs';

interface Holiday {
  date: string;
  name: string;
}

type CalendarEventWithMeta = CalendarEvent<{type: 'holiday'; holiday: Holiday} | {type: 'normal'}>;

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private readonly HOLIDAY_API_KEY = '04ad509e-2418-49ce-8426-2e77cc5ac332';
  private readonly COUNTRY_CODE = 'FR-OCC';
  private readonly URL = 'https://holidayapi.com/v1/holidays';

  constructor(private http: HttpClient) {}

  public fetchHolidays(): Observable<CalendarEventWithMeta[]> {
    const params = {
      country: this.COUNTRY_CODE,
      year: String(new Date().getFullYear() - 1),
      key: this.HOLIDAY_API_KEY
    };
    return this.http
      .get<Holiday[]>(this.URL, {params})
      .pipe(map((holidays: Holiday[]) => holidays.map((holiday: Holiday) => this.mapperHoliday(holiday))));
  }

  private mapperHoliday(holiday: Holiday): CalendarEventWithMeta {
    return {
      start: new Date(holiday.date),
      title: holiday.name,
      allDay: true,
      meta: {
        type: 'holiday',
        holiday
      }
    };
  }
}
