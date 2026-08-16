import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RssItem } from '@core/services/rss.service';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  public items: RssItem[] = [];

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.items = data['items'];
    });
  }

  public onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.remove('img-placeholder');
  }
}
