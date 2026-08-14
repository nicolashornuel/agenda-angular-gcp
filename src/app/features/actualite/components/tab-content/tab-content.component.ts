import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resolvable } from '@core/models/resolvable.model';
import { RssItem } from '@core/services/rss.service';
import { RssFeedResolver } from '@features/actualite/services/actualite.resolver.service';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private feedResolver = inject(RssFeedResolver);
  public resolvable!: Resolvable<RssItem[]>;

  ngOnInit(): void {
    this.resolvable = this.feedResolver.resolveItems(this.activatedRoute);
  }

  public onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('img-placeholder');
  }
}
