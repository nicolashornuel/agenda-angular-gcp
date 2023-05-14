import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';

interface Record {
  datasetid: string;
  fields: Field;
}
interface Field {
  annee_scolaire: string;
  description: string;
  end_date: string;
  location: string;
  start_date: string;
  zones: string;
}

export interface Holiday {
  description: string;
  end: Date;
  start: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  // https://data.education.gouv.fr/explore/dataset/fr-en-calendrier-scolaire/api/?disjunctive.description&disjunctive.population&disjunctive.location&disjunctive.zones&disjunctive.annee_scolaire&sort=end_date&timezone=&refine.zones=Zone+C&refine.annee_scolaire=2022-2023&refine.location=Montpellier&exclude.population=%C3%89l%C3%A8ves
  private openAPI = {
    url: 'https://data.education.gouv.fr/api/records/1.0/search/',
    params: {
      dataset: 'fr-en-calendrier-scolaire',
      'refine.zone': 'Zone C',
      'refine.annee_scolaire': '2022-2023',
      'refine.location': 'Montpellier',
      'exclude.population': 'Enseignants'
    }
  };

  private readonly holidays$ = new BehaviorSubject<Holiday[]>([]);

  constructor(private http: HttpClient) {}

  public init(): void {
    this.getAll()
      .pipe(take(1))
      .subscribe(holidays => (this.setHolidays$ = holidays));
  }

  public get getHolidays$(): Observable<Holiday[]> {
    return this.holidays$.asObservable();
  }

  public set setHolidays$(holidays: Holiday[]) {
    this.holidays$.next([...holidays]);
  }

  public getAll(): Observable<Holiday[]> {
    return this.http
      .get<{records: Record[]}>(this.openAPI.url, {params: this.openAPI.params})
      .pipe(map(({records}) => records.map(record => this.mapperHoliday(record))));
  }

  private mapperHoliday({fields}: Record): Holiday {
    return {
      start: new Date(fields.start_date.substring(0,10)),
      end: new Date(fields.end_date.substring(0,10)),
      description: fields.description
    };
  }
}
