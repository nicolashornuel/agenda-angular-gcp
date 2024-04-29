import { Component, OnInit } from '@angular/core';
import { RssService } from 'app/musique/services/rss.service';
import { take } from 'rxjs/operators';

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
    this.fetchData(this.rssUrl);
  }

  /**
   * GET xml
   *
   * @private
   * @memberof RssFluxComponent
   */
  private fetchData(url: string): void {
    this.rss
      .getRSSFeedData(url)
      .pipe(take(1))
      .subscribe(async data => {
        await this.transformData(data);
      });
  }

  /**
   * TRANSFORM xml to string
   *
   * @private
   * @param {*} data
   * @memberof RssFluxComponent
   */
  private async transformData(data: any) {
    const xmlData = this.rss.parseXML(data);
    let items: any[] = [];
    xmlData.querySelectorAll('description').forEach((item: {childNodes: any[]}) => {
      item.childNodes.forEach(i => {
        const html = this.rss.parseHTML(i.textContent);
        html.querySelectorAll('b').forEach((element: any) => {
          items.push(element.textContent);
        });
      });
    });
    this.rssThread = items.join(' -- ');
  }

}
