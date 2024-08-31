import { Component, ComponentRef, OnInit } from '@angular/core';
import { TabParam } from '@shared/components/tabs/tabs.component';
import { DestroyService } from '@shared/services/destroy.service';
import { IsMobileService } from '@shared/services/shared.observable.service';
import { combineLatest, take, takeUntil } from 'rxjs';
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
  public isMobile!: boolean;

  constructor(private destroy$: DestroyService, private tabService: TabResultService, private isMobileService: IsMobileService,) {}

  ngOnInit(): void {
    combineLatest([this.tabService.get$.pipe(takeUntil(this.destroy$)), this.isMobileService.get$.pipe(take(1))])
    .subscribe(values => {
      this.tabs.push(this.createTabResult(values[0]));
      this.tabSelected = this.tabs.length - 1;
      this.isMobile = values[1]!;
    });
    this.checkNavigation();
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
