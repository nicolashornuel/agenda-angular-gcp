import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestroyService } from '@shared/services/destroy.service';
import { RssCard } from 'app/actualite/models/rss-card.model';
import { RssFeedResolver } from 'app/actualite/services/rss-feed.resolver';
import { switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  public cards: RssCard[] = [];
  public isLoading = false;
  private activatedRoute = inject(ActivatedRoute);
  private feedResolver = inject(RssFeedResolver);
  private destroy$ = inject(DestroyService);

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.isLoading = true),
        switchMap(params => this.feedResolver.resolveSlug(params))
      )
      .subscribe(cards => {
        this.cards = cards;
        this.isLoading = false;
      });
  }

  public onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('img-placeholder');
  }
}
