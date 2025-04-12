import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RssCard } from 'app/actualite/models/rss-card.model';
import { Resolvable, RssFeedResolver } from 'app/actualite/services/rss-feed.resolver';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private feedResolver = inject(RssFeedResolver);
  public resolvable!: Resolvable<RssCard[]>;

  ngOnInit(): void {
    this.resolvable = this.feedResolver.resolveCards(this.activatedRoute);
  }

  public onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('img-placeholder');
  }
}
