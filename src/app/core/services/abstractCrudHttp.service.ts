import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';
import {Observable} from 'rxjs';

export abstract class AbstractCrudHttpService<T> {
  protected url: string;

  constructor(protected http: HttpClient, path: string) {
    this.url = `${environment.urlBackEnd}/${path}`;
  }

  public getList(): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}/getList`);
  }

  public getOne(id: string): Observable<T> {
    return this.http.get<T>(`${this.url}/getOne/${id}`);
  }
  
  public create(t: T): Observable<T> {
    return this.http.post<T>(`${this.url}/create`, t);
  }

  public delete(id: string): Observable<T> {
    return this.http.delete<T>(`${this.url}/delete/${id}`);
  }

  public update(t: T): Observable<T> {
    return this.http.put<T>(`${this.url}/update`, t);
  }

}
