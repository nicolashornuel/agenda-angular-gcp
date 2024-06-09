import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DiscogsService {
  private url: string = environment.urlApiDiscogs;
  private params: any = {
    q: '',
    per_page: 12,
    token: environment.discogsToken,
    artist: ''
  };

  constructor(private http: HttpClient) {}

  getByArtistName(keyword: string): Observable<any> {
    this.params.artist = keyword;
    return this.http.get(this.url, {params: this.params, responseType: 'json'}).pipe(
      map((res: any) => ({
        pagination: res.pagination,
        results: res.results.map((elt: any) => {
          return {
            thumb: elt.thumb,
            title: elt.title,
            year: elt.year,
            country: elt.country,
            style: elt.style ? elt.style.join(', ') : null,
            label: [...new Set(elt.label)].slice(0, 1).join(', '),
            format: [...new Set(elt.format)].join(', '),
            genre: [...new Set(elt.genre)].join(', ')
          };
        })
      }))
    );
  }
}
