import { Component, ComponentRef, OnInit } from '@angular/core';
import { TabParam } from '@shared/models/tabParam.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { IsMobileService } from '@shared/services/shared.observable.service';
import { take, takeUntil } from 'rxjs';
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
  public isMobile!: boolean;

  constructor(
    private destroy$: DestroyService,
    private tabService: TabResultService,
    private isMobileService: IsMobileService
  ) {}

  ngOnInit(): void {
    this.isMobileService.get$.pipe(take(1)).subscribe(isMobile => (this.isMobile = isMobile!));

    this.tabService.get$.pipe(takeUntil(this.destroy$)).subscribe(keyword => {
      this.tabs.push(this.createTabResult(keyword));
      this.tabSelected = this.tabs.length - 1;
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
      order: OrderYoutube.VIEWCOUNT
    };

    return {
      name: param.keyword,
      closable: true,
      content: SearchResultComponent,
      bind: (componentRef: ComponentRef<SearchResultComponent>) => (componentRef.instance.param = param)
    };
  }
}
