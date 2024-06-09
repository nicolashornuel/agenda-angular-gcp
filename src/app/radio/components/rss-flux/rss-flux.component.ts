import {Component, OnInit} from '@angular/core';
import { RssService } from 'app/radio/services/rss.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-rss-flux',
  templateUrl: './rss-flux.component.html',
  styleUrls: ['./rss-flux.component.scss']
})
export class RssFluxComponent implements OnInit {
  private rssUrl = 'https://www.developpez.com/index/rss';
  public rssThread: string = '';

  constructor(private rss: RssService) {}

  ngOnInit(): void {
    this.rss
    .getRSSFeedData(this.rssUrl)
    .pipe(take(1))
    .subscribe(data => this.transformData(data));
  }

  private transformData(data: any) {
    let items: any[] = [];

    // XML
    const xml = this.rss.parseXML(data);
    xml.querySelectorAll('description').forEach((description: {childNodes: any[]}, index: any) => {
      let cleanDescription = index > 0 ? index : '';
      description.childNodes.forEach(childNode => {
        // HTML
        const html = this.rss.parseHTML(childNode.textContent);
        html.querySelectorAll('b').forEach((element: any) => (cleanDescription += ` ${element.textContent}`));

        items.push(cleanDescription);
      });
    });
    this.rssThread = items.join(' -- ');
  }
}
