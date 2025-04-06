import { inject, Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { TabParam } from '@shared/models/tabParam.interface';
import { UtilService } from '@shared/services/util.service';
import { map, Observable, switchMap } from 'rxjs';
import { RssCard } from '../models/rss-card.model';
import { RssFeed } from '../models/rss-feed.model';
import { RssFeedService } from './rss-feed.service';
import { RssMapperService } from './rss-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class RssFeedResolver {
  private utilService = inject(UtilService);
  private feedRepository = inject(RssFeedService);
  private fetchFunction = inject(AbstractFetchFunctionService);
  private feedMapper = inject(RssMapperService);

  public resolveTabs(): Observable<TabParam[]> {
    return this.feedRepository.getAll().pipe(
      map(feeds =>
        this.utilService
          .sortInByAsc(feeds, RssFeed.ORDER_KEY.key)
          .map(feed => new TabParam(feed.name, false, feed.slug))
      )
    );
  }

  public resolveSlug(params: ParamMap) {
    const filterDefault = {
      key: RssFeed.ORDER_KEY.key,
      value: 1
    };
    const filterBySlug = {
      key: RssFeed.SLUG_KEY.key,
      value: params.get(RssFeed.SLUG_KEY.key)
    };
    return this.getOrDefault(params.get(RssFeed.SLUG_KEY.key) ? filterBySlug : filterDefault);
  }

  private getOrDefault(query: { key: string; value: any }): Observable<RssCard[]> {
    return this.feedRepository.getByQuery(RssFeed.ORDER_KEY.key, query).pipe(
      map(feeds => feeds.at(0)),
      switchMap(feed => this.fetchFunction.getText(feed!.url)),
      map(doc => this.feedMapper.createCards(doc.data))
    );
  }
}
