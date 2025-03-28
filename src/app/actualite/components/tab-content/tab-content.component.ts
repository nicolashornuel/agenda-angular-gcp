import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { DestroyService } from '@shared/services/destroy.service';
import { RssCard } from 'app/actualite/models/rss-card.model';
import { RssFeed } from 'app/actualite/models/rss-feed.model';
import { RssMapperService } from 'app/actualite/services/rss-mapper.service';
import { RssObservableService } from 'app/actualite/services/rss-observable.service';
import { Observable, map, switchMap, takeUntil, take, tap, filter, from } from 'rxjs';
import { AbstractController } from '@shared/abstracts/abstract-controller.directive';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  @Input() url!: string;
  public loading = false;
  public cards: RssCard[] = [];
  public activatedRoute = inject(ActivatedRoute);
  public destroy$ = inject(DestroyService);
  private rssObservable = inject(RssObservableService);

  constructor(private mapper: RssMapperService, private fetchService: AbstractFetchFunctionService) {}

  ngOnInit(): void {
    this.listenNavigation(this.route$);
  }

  public listenNavigation(getRoute$: (params: ParamMap) => Observable<RssCard[]>) {
    this.loading = true;
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy$), switchMap(getRoute$)).subscribe((t: RssCard[]) => {
      this.cards = t;
      this.loading = false;
    });
  }

  protected get route$() {
    return (params: ParamMap) =>
      this.rssObservable.get$.pipe(
        tap(() => (this.loading = true)),
        take(1),
        map(feeds => feeds?.find(feed => feed.slug === params.get('slug')) ?? feeds?.[0]),
        switchMap((feed: RssFeed | undefined) => this.fetchService.getText(feed!.url)),
        map(document => this.mapper.createCards(document.data))
      );
  }

  public onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('img-placeholder');
  }
}
