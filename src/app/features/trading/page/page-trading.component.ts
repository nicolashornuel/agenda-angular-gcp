import { Component } from '@angular/core';
import { ScreenerDetailComponent } from '../components/screener-detail/screener-detail.component';
import { ScreenerListComponent } from '../components/screener-list/screener-list.component';
import { ChartComponent } from '../components/chart/chart.component';
import { TabParam } from '@shared/models/tabParam.interface';

@Component({
  selector: 'app-page-trading',
  templateUrl: './page-trading.component.html',
  styleUrls: ['./page-trading.component.scss']
})
export class PageTradingComponent {

  public tabs: TabParam[] = [
    {
      name: 'chart',
      closable: false,
      content: ChartComponent
    },
    {
      name: 'screener-list',
      closable: false,
      content: ScreenerListComponent
    },
    {
      name: 'screener-detail',
      closable: false,
      content: ScreenerDetailComponent
    }
  ];

}
