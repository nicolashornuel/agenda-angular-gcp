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
    xml.querySelectorAll('item').forEach((item: any) => {
      const card = this.createCard(item);
      if (card)
      cards.push(card)
    });
    return cards;
  }

  public createCard(item: any): RssCard | null {
    let img = item.querySelector('content') ? item.querySelector('content').getAttribute('url') : 'assets/placeholder-image.webp';
    img = item.querySelector('enclosure') ? item.querySelector('enclosure').getAttribute('url') : img;    

    return item.querySelector('enclosure') ? {
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      description: this.cleanDescription(item.querySelector('description')?.textContent || ''),
      img,
      pubDate: item.querySelector('pubDate')?.textContent || undefined,
      category: item.querySelector('category')?.textContent || undefined
    } : null;
  }

  private cleanDescription(description: string): string {
    const doc = this.parseHTML(description);
    const text = doc.body.textContent || '';
    return text.replace(/<img[^>]*>/g, '');;
  }
}
