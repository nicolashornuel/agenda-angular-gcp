import { Component, Input, OnInit } from '@angular/core';
import { AbstractFetchFunctionService } from '@core/services/abstractFetchFunction.service';
import { RssCard, RssService } from '@core/services/rss.service';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit {
  @Input() url!: string;
  public loading = false;
  public cards: RssCard[] = [];

  constructor(private rss: RssService, private fetchService: AbstractFetchFunctionService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const { data } = await this.fetchService.getText(this.url);
    this.cards.push(...this.rss.createCards(data));
    this.loading = false;
  }
}
