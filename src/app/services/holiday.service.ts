import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {Observable, map, take, tap} from 'rxjs';
import {EventService} from './event.service';

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

  constructor(private http: HttpClient, private eventService: EventService) {}

  public init(): void {
    this.fetchHolidays()
      .pipe(take(1))
      .subscribe(holidays => this.eventService.setEvents$(holidays));
  }

  public fetchHolidays(): Observable<CalendarEventWithMeta[]> {
    const params = {
      country: this.COUNTRY_CODE,
      year: String(new Date().getFullYear() - 1),
      key: this.HOLIDAY_API_KEY
    };
    console.log(params);
    
    return this.http
      .get<{holidays: Holiday[]}>(this.URL, {params})
      .pipe(map(({holidays}) => holidays.map(holiday => this.mapperHoliday(holiday))));
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
