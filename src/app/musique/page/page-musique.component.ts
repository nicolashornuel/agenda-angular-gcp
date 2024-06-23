import { Component, ComponentRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabParam } from '@shared/components/tabs/tabs.component';
import { DestroyService } from '@shared/services/destroy.service';
import { takeUntil } from 'rxjs';
import { ListSavedComponent } from '../components/list-saved/list-saved.component';
import { SearchResultComponent } from '../components/search-result/search-result.component';
import { TabResultService } from '../services/musique.observable.service';
import { OrderYoutube } from '../services/youtube.service';

@Component({
  selector: 'app-page-musique',
  templateUrl: './page-musique.component.html',
  styleUrls: ['./page-musique.component.scss']
})
export class PageMusiqueComponent implements OnInit {
  public tabs: TabParam[] = [
    {
      name: 'Playlist',
      closable: false,
      content: ListSavedComponent
    }
  ];
  public tabSelected = 0;

  public orderYoutubeOptions = Object.values(OrderYoutube).map(order => ({
    name: order.toLowerCase(),
    value: order
  }));

  public orderYoutubeSelected = this.orderYoutubeOptions.find(order => order.value === OrderYoutube.VIEWCOUNT);

  constructor(private destroy$: DestroyService, private tabService: TabResultService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.listenTabService();
    this.checkNavigation();
  }

  private listenTabService(): void {
    this.tabService.get$.pipe(takeUntil(this.destroy$)).subscribe(keyword => {
      this.tabs.push(this.createTabResult(keyword));
      this.tabSelected = this.tabs.length - 1;
    });
  }

  private checkNavigation(): void {
    if (history.state.keyword) this.tabService.set$(history.state.keyword);
  }

  onSearch(keyword: string): void {
    this.tabService.set$(keyword);
  }

  private createTabResult(keyword: string): TabParam {
    const param = {
      keyword,
      order: this.orderYoutubeSelected!.value
    };
    return {
      name: [param.keyword, param.order].join(' '),
      closable: true,
      content: SearchResultComponent,
      bind: (componentRef: ComponentRef<SearchResultComponent>) => (componentRef.instance.param = param)
    };
  }
}
