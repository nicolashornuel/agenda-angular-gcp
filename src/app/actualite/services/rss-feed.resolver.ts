import { Component, Inject, inject, Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { TabParam } from '@shared/models/tabParam.interface';
import { UtilService } from '@shared/services/util.service';
import { filter, map, Observable, switchMap, take, takeUntil, tap } from 'rxjs';
import { RssCard } from '../models/rss-card.model';
import { RssFeed } from '../models/rss-feed.model';
import { RssFeedService } from './rss-feed.service';
import { RssMapperService } from './rss-mapper.service';
import { DestroyService } from '@shared/services/destroy.service';

export interface Resolvable<T = any> {
  route: ActivatedRoute;
  isLoading: boolean;
  data: T;
}

export class Resolvable<T = any> {
  constructor(route: ActivatedRoute, data: T) {
    this.route = route;
    this.isLoading = false;
    this.data = data;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RssFeedResolver<T = any> {
  private utilService = inject(UtilService);
  private feedRepository = inject(RssFeedService);
  private fetchFunction = inject(AbstractFetchFunctionService);
  private feedMapper = inject(RssMapperService);
  private destroy$ = inject(DestroyService);
  private router = inject(Router);

  public resolveTabs(route: ActivatedRoute): Resolvable<T[]> {
    let resolvable = new Resolvable(route, []);
    const callback = (params: ParamMap) => this.feedRepository.getAll().pipe(
      map(feeds =>
        this.utilService
          .sortInByAsc(feeds, RssFeed.ORDER_KEY.key)
          .map(feed => new TabParam(feed.name, false, feed.slug))
      ),
      tap((feeds) =>  {
        if (!params.get(RssFeed.SLUG_KEY.key)) 
          this.router.navigate([feeds.at(0)?.link], { relativeTo: route })
        }
      )
    );
    this.resolve(resolvable, callback);
    return resolvable;
  }

  public resolveCards(route: ActivatedRoute): Resolvable<T[]> {
    let resolvable = new Resolvable(route, []);
    const callback = (params: ParamMap) => {
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
    this.resolve(resolvable, callback);
    return resolvable;
  }

  private resolve(resolvable: Resolvable, callback: any): void {
    resolvable.route.paramMap.pipe(
      takeUntil(this.destroy$),
      tap(() => resolvable.isLoading = true),
      switchMap(callback)).subscribe(data => {
      resolvable.data = data;
      resolvable.isLoading = false;
    });
  }

  private getOrDefault(query: { key: string; value: any }): Observable<RssCard[]> {
    return this.feedRepository.getByQuery({fieldPath: RssFeed.ORDER_KEY.key}, query).pipe(
      take(1),
      filter(feeds => feeds.length > 0),
      map(feeds => feeds.at(0)),
      switchMap(feed => this.fetchFunction.getText(feed!.url)),
      map(doc => this.feedMapper.createCards(doc.data))
    );
  }
}
