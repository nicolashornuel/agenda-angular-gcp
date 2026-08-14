import { Component, ComponentRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TabParam } from '@shared/models/tabParam.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { IsMobileService } from '@shared/services/shared.observable.service';
import { take, takeUntil } from 'rxjs';
import { ListSavedComponent } from '../components/list-saved/list-saved.component';
import { SearchParam, SearchResultComponent } from '../components/search-result/search-result.component';
import { TabResultService } from '../services/musique.observable.service';

@Component({
  selector: 'app-page-musique',
  templateUrl: './page-musique.component.html',
  styleUrls: ['./page-musique.component.scss']
})
export class PageMusiqueComponent implements OnInit {
  private destroy$ = inject(DestroyService);
  private tabService = inject(TabResultService);
  private isMobileService = inject(IsMobileService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public tabs: TabParam[] = [
    {
      name: 'Playlist',
      closable: false,
      content: ListSavedComponent
    }
  ];
  public isMobile!: boolean;

  ngOnInit(): void {
    this.listenMobile();
    this.listenSearch();
    this.listenNavigation();
  }

  public onSearch(keyword: string): void {
    this.tabService.set$({ type: 'keyword', name: keyword, q: keyword });
  }

  private listenMobile(): void {
    this.isMobileService.get$.pipe(take(1)).subscribe(isMobile => (this.isMobile = isMobile));
  }

  private listenNavigation(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const searchParam = this.getSearchParam(params);
      if (searchParam) this.addSearchTab(searchParam);
    });
  }

  private listenSearch(): void {
    this.tabService.get$.pipe(takeUntil(this.destroy$)).subscribe(param => this.addSearchTab(param!));
  }

  private getSearchParam(params: ParamMap): SearchParam | undefined {
    const channelId = params.get('channelId');
    const channelTitle = params.get('channelTitle');
    const keyword = params.get('keyword');

    if (channelId && channelTitle) return { type: 'channelId', name: channelTitle, q: channelId };
    if (channelTitle) return { type: 'channelTitle', name: channelTitle, q: channelTitle };
    if (keyword) return { type: 'keyword', name: keyword, q: keyword };

    return undefined;
  }

  private addSearchTab(param: SearchParam): void {
    this.tabs = [...this.tabs, this.createTabResult(param)]
  }

  private createTabResult(param: SearchParam): TabParam {
    return {
      name: param.name,
      closable: true,
      content: SearchResultComponent,
      bind: (componentRef: ComponentRef<SearchResultComponent>) => (componentRef.instance.param = param),
      onClose: () => this.clearNavigationParams()
    };
  }

  private clearNavigationParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        channelId: null,
        channelTitle: null,
        keyword: null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
