import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { DestroyService } from '@shared/services/destroy.service';
import { RssCard } from 'app/actualite/models/rss-card.model';
import { RssFeed } from 'app/actualite/models/rss-feed.model';
import { RssMapperService } from 'app/actualite/services/rss-mapper.service';
import { RssObservableService } from 'app/actualite/services/rss-observable.service';
import { map, switchMap, takeUntil, tap } from 'rxjs';

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
    this.loading = true;
    this.activatedRoute.paramMap.pipe(
      takeUntil(this.destroy$),
      tap(h => console.log(h)),
      switchMap((params: ParamMap) => this.rssObservable.get$.pipe(
        map(feeds => {

          const feed = feeds?.find(feed => feed.name === params.get('slug'))
          console.log(feed);
          return feed;
          
        })
      ))
    ).subscribe(async (feed: RssFeed | undefined) => {
      if (!feed) return;
      const { data } = await this.fetchService.getText(feed.url);
      this.cards.push(...this.mapper.createCards(data));
      this.loading = false;
    });
  }

  public onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('img-placeholder');
  }
}
