import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {Preference} from '../models/preference.interface';
import {concatMap, filter, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  private URL_BACKEND: string = environment.urlBack;
  private preference$: BehaviorSubject<Preference> = new BehaviorSubject<Preference>(null);

  constructor(private http: HttpClient) {}

  public async init(): Promise<Preference> {
    return this.http
      .get<Preference[]>(`${this.URL_BACKEND}pref`)
      .toPromise()
      .then((preferences: Preference[]) => {
        this.setPreference(preferences[0])
        return preferences[0]
      })
  }

  /**
   * READ preference FROM database
   *
   * @return {*}  {Observable<Preference>}
   * @memberof PreferenceService
   */
  public find(): Observable<Preference> {
    return this.http.get<Preference[]>(`${this.URL_BACKEND}pref`).pipe(
      map((preferences: Preference[]) => {
        return preferences[0];
      }),
      tap((preference: Preference) => {
        this.setPreference(preference);
      })
    );
  }

  /**
   * CREATE preference into database
   *
   * @param {Preference} preference
   * @return {*}  {Observable<Preference>}
   * @memberof PreferenceService
   */
  public create(preference: Preference): Observable<Preference> {
    const result = this.http.post<Preference>(`${this.URL_BACKEND}pref`, preference);
    return result;
  }

  /**
   * UPDATE preference into database
   *
   * @param {Preference} preference
   * @return {*}  {Observable<string>}
   * @memberof PreferenceService
   */
  public update(preference: Preference): Observable<string> {
    const result = this.http.put<string>(`${this.URL_BACKEND}pref`, preference);
    this.setPreference(preference);
    return result;
  }

  /**
   * GETTER Preference inside global app
   *
   * @readonly
   * @type {Observable<Preference>}
   * @memberof PreferenceService
   */
  public get getPreference$(): Observable<Preference> {
    return this.preference$.asObservable();
  }

  /**
   * SETTER Preference inside global app
   *
   * @param {Preference} preference
   * @memberof PreferenceService
   */
  public setPreference(preference: Preference): void {
    this.preference$.next(preference);
  }
}
