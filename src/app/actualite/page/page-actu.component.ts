import { Component, ComponentRef, inject } from '@angular/core';
import { AbstractController } from '@shared/abstracts/abstract-controller.directive';
import { TabParam } from '@shared/components/tabs/tabs.component';
import { take, tap } from 'rxjs';
import { TabContentComponent } from '../components/tab-content/tab-content.component';
import { RssCard } from '../models/rss-card.model';
import { RssFeed } from '../models/rss-feed.model';
import { RssFeedService } from '../services/rss-feed.service';
import { RssObservableService } from '../services/rss-observable.service';

@Component({
  selector: 'app-page-actu',
  templateUrl: './page-actu.component.html',
  styleUrls: ['./page-actu.component.scss']
})
export class PageActuComponent extends AbstractController<RssFeed> {

  public cards: RssCard[] = [];
  public tabs: TabParam[] = [];
  public tabSelected = 0;
  private feedService = inject(RssFeedService);
  private rssObservable = inject(RssObservableService);

  protected override initComponent(): void {
    this.data.forEach(feed => this.tabs.push(this.createTab(feed)));
  }

  protected override get data$() {
    return this.feedService.getAll().pipe(
      take(1),
      tap((feeds:RssFeed[])=> this.rssObservable.set$(feeds))
    );
  }

  private createTab(feed: RssFeed): TabParam {
    return {
      name: feed.name,
      closable: false,
      link: feed.slug,
      /* content: TabContentComponent,
      bind: (componentRef: ComponentRef<TabContentComponent>) => (componentRef.instance.url = feed.url) */
    };
  }
}
