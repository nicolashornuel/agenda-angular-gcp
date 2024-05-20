import {Component, ComponentRef, OnInit} from '@angular/core';
import {TabParam} from '@shared/components/tabs/tabs.component';
import {DestroyService} from '@shared/services/destroy.service';
import {takeUntil} from 'rxjs';
import {ListSavedComponent} from '../components/list-saved/list-saved.component';
import {SearchResultComponent} from '../components/search-result/search-result.component';
import {TabResultService} from '../services/musique.observable.service';

@Component({
  selector: 'app-page-musique',
  templateUrl: './page-musique.component.html',
  styleUrls: ['./page-musique.component.scss']
})
export class PageMusiqueComponent implements OnInit {
  public tabs: TabParam[] = [
    {
      name: 'Liste',
      closable: false,
      content: ListSavedComponent
    }
  ];
  public tabSelected = 0;

  constructor(private destroy$: DestroyService, private tabService: TabResultService) {}

  ngOnInit(): void {
    this.tabService.get$
      .pipe(takeUntil(this.destroy$))
      .subscribe(keyword => {
        this.tabs.push(this.createTabResult(keyword));
        this.tabSelected = this.tabs.length - 1;
      });
  }

  onSearch(keyword: string) {
    this.tabService.set$(keyword);
  }

  private createTabResult(keyword: string): TabParam {
    return {
      name: keyword,
      closable: true,
      content: SearchResultComponent,
      bind: (componentRef: ComponentRef<SearchResultComponent>) => (componentRef.instance.keyword = keyword)
    };
  }
}
