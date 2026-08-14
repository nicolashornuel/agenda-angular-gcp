import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WidgetScreenerDirective} from './directive/widget-screener.directive';
import {WidgetAnalysisDirective} from './directive/widget-analysis.directive';
import { PageTradingComponent } from './page/page-trading.component';
import { SharedModule } from '@shared/shared.module';
import { TradingRoutingModule } from './trading-routing.module';
import { ScreenerDetailComponent } from './components/screener-detail/screener-detail.component';
import { ScreenerListComponent } from './components/screener-list/screener-list.component';
import { ChartComponent } from './components/chart/chart.component';
import { WidgetChartDirective } from './directive/widget-chart.directive';

const TradingElements = [
  WidgetScreenerDirective,
  WidgetAnalysisDirective,
  WidgetChartDirective,
  PageTradingComponent,
  ScreenerListComponent,
  ScreenerDetailComponent,
  ChartComponent
]

@NgModule({
  declarations: [TradingElements],
  imports: [
    CommonModule,
    SharedModule,
    TradingRoutingModule
  ]
})
export class TradingModule { }
