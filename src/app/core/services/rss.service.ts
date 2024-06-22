import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RssCard {
  title: string;
  link: string;
  description: string;
  img: string;
  pubDate: Date;
  creator?: string;
  category?: string;
}
export interface RssFeed {
  url: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class RssService {
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
/*     const description: string = item.querySelector('description').textContent;
    const indexOf = description.indexOf('<br />');
    const finalDescription = indexOf != -1 ? description.substring(0, indexOf) : description; */
    return {
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
      img: item.querySelector('enclosure').getAttribute('url'),
      pubDate: item.querySelector('pubDate').textContent
    };
  }
}
