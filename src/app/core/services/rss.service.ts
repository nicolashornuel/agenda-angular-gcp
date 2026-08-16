import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RssItem {
  title: string;
  link: string;
  description: string;
  img: string;
  pubDate: Date;
  creator?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RssService {
  constructor(private http: HttpClient) {}

  public getRSSFeedData(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }

  public parseXML(data: string): Document {
    return new DOMParser().parseFromString(data, 'application/xml');
  }

  public parseHTML(data: string): Document {
    return new DOMParser().parseFromString(data, 'text/html');
  }

  public createItems(document: string, placeholderImg = 'assets/placeholder-image.webp'): RssItem[] {
    const cards: RssItem[] = [];
    const xml = this.parseXML(document);
    xml.querySelectorAll('item').forEach(item => {
      const card = this.createItem(item, placeholderImg);
      if (card) cards.push(card);
    });
    return cards;
  }

  private createItem(item: Element, placeholderImg: string): RssItem | null {
    let img = item.querySelector('content')?.getAttribute('url') ?? placeholderImg;
    img = item.querySelector('enclosure')?.getAttribute('url') ?? img;

    return {
      title: item.querySelector('title')?.textContent ?? '',
      link: item.querySelector('link')?.textContent ?? '',
      description: this.cleanDescription(item.querySelector('description')?.textContent ?? ''),
      img,
      pubDate: new Date(item.querySelector('pubDate')?.textContent ?? ''),
      category: item.querySelector('category')?.textContent || undefined
    };
  }

  private cleanDescription(description: string): string {
    const text = this.parseHTML(description).body.textContent ?? '';
    return text.replace(/<img[^>]*>/g, '');
  }
}
