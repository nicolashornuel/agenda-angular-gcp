import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RssCard } from 'app/actualite/models/rss-card.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RssMapperService {
  constructor(private http: HttpClient) {}

  public getRSSFeedData(url: string): Observable<any> {
    const requestOptions: object = {
      responseType: 'text'
    };
    return this.http.get<any>(url, requestOptions);
  }

  public parseXML(data: any): any {
    var parser = new DOMParser();
    return parser.parseFromString(data, 'application/xml');
  }

  public parseHTML(data: any): any {
    var parser = new DOMParser();
    return parser.parseFromString(data, 'text/html');
  }

  public createCards(document: Document): RssCard[] {
    let cards: RssCard[] = [];
    const xml = this.parseXML(document);
    xml.querySelectorAll('item').forEach((item: any) => cards.push(this.createCard(item)));
    return cards;
  }

  public createCard(item: any): RssCard {
    let img = item.querySelector('content') ? item.querySelector('content').getAttribute('url') : undefined;
    img = item.querySelector('enclosure') ? item.querySelector('enclosure').getAttribute('url') : img;

    return {
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      description: this.cleanDescription(item.querySelector('description')?.textContent || ''),
      img,
      pubDate: item.querySelector('pubDate')?.textContent || undefined,
      category: item.querySelector('category')?.textContent || undefined
    };
  }

  private cleanDescription(description: string): string {
    const doc = this.parseHTML(description);
    const text = doc.body.textContent || '';
    return text.replace(/<img[^>]*>/g, '');;
  }
}
