import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// https://en.wikipedia.org/wiki/Special:ApiSandbox
export interface QueryWikipedia {
  origin: string;
  action: string;
  format: string;
  uselang: string;
  prop: string;
  titles: string;
  redirects: number;
  converttitles: number;
  exintro: number;
  explaintext: number;
}

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {
  private params: any = {
    origin: '*',
    action: 'query',
    format: 'json',
    uselang: 'user',
    prop: 'extracts',
    titles: null,
    redirects: 1,
    converttitles: 1,
    exintro: 1,
    explaintext: 1
  };

  constructor(private http: HttpClient) {}

  getWiki(keyword: string, lang: string): Observable<string | undefined> {
    let url = `https://${lang}.wikipedia.org/w/api.php?`;
    this.params.titles = keyword;
    return this.http.get(url, { params: this.params, responseType: 'json' }).pipe(
      map((result: any) => {
        let extracts = undefined;
        for (let i in result.query.pages) {
          if (result.query.pages[i].extract) extracts = result.query.pages[i].extract;
        }
        return extracts;
      })
    );
  }
}
