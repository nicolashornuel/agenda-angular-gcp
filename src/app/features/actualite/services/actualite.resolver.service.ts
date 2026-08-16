import { inject, Injectable } from '@angular/core';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { RssItem, RssService } from '@core/services/rss.service';
import { TabParam } from '@shared/models/tabParam.interface';
import { Utils } from '@shared/utils/utils';
import { map, Observable, shareReplay, switchMap } from 'rxjs';
import { FirestoreRssFeedService } from './actualite.firestore.service';
import { RssFeed } from '../models/actualite.model';

@Injectable()
export class RssFeedResolverService {
  private readonly feedService = inject(FirestoreRssFeedService);
  private readonly fetchFunction = inject(AbstractFetchFunctionService);
  private readonly feedMapper = inject(RssService);

  private readonly feeds$ = this.feedService.getAll().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getTabs(): Observable<TabParam[]> {
    return this.feeds$.pipe(
      map(feeds => Utils.sortByAsc(feeds, RssFeed.ORDER_KEY.key).map(feed => new TabParam(feed.name, false, feed.slug)))
    );
  }

  getItems(slug: string): Observable<RssItem[]> {
    return this.feeds$.pipe(
      map(feeds => feeds.find(feed => feed.slug === slug)),
      switchMap(feed => this.fetchFunction.getText(feed!.url)),
      map(doc => this.feedMapper.createItems(doc.data))
    );
  }
}
