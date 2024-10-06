import { Component, ComponentRef, OnInit } from '@angular/core';
import { RssCard, RssFeed } from '@core/services/rss.service';
import { TabParam } from '@shared/components/tabs/tabs.component';
import { TabContentComponent } from '../components/tab-content/tab-content.component';
import { ListComponent } from '../components/list/list.component';

@Component({
  selector: 'app-page-actu',
  templateUrl: './page-actu.component.html',
  styleUrls: ['./page-actu.component.scss']
})
export class PageActuComponent implements OnInit {

  //https://www.cnews.fr/les-flux-rss-de-cnewsfr
  //https://www.bfmtv.com/rss/
  private feeds: RssFeed[] = [
    {
      url: 'https://www.cnews.fr/rss.xml',
      name: 'CNEWS'
    },
    {
      url: 'https://www.bfmtv.com/rss/news-24-7/',
      name: 'BFMTV'
    },
    {
      url: 'https://www.developpez.com/index/rss',
      name: 'developpez.com'
    },
    {
      url: 'https://www.france24.com/fr/rss',
      name: 'france24.com'
    }
  ];

  public loading = false;
  public cards: RssCard[] = [];
  public tabs: TabParam[] = [];
  public tabSelected = 0;

  ngOnInit(): void {
    this.feeds.forEach(feed => this.tabs.push(this.createTab(feed)));
  }

  private createTab(feed: RssFeed): TabParam {
    /* return {
      name: feed.name,
      closable: false,
      content: ListComponent,
      bind: (componentRef: ComponentRef<ListComponent>) => (componentRef.instance.url = feed.url)
    }; */
    return {
      name: feed.name,
      closable: false,
      content: TabContentComponent,
      bind: (componentRef: ComponentRef<TabContentComponent>) => (componentRef.instance.url = feed.url)
    };
  }
}
