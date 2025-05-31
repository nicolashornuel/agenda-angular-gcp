import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ForecastCardComponent } from './components/forecast-card/forecast-card.component';
import { PageMeteoComponent } from './page/page-meteo.component';
import { ForecastChartComponent } from './components/forecast-chart/forecast-chart.component';
import { ForecastMapComponent } from './components/forecast-map/forecast-map.component';

const routes: Routes = [
  {path: '', component: PageMeteoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeteoRoutingModule { }

@NgModule({
  declarations: [
    ForecastCardComponent,
    PageMeteoComponent,
    ForecastChartComponent,
    ForecastMapComponent
  ],
  imports: [MeteoRoutingModule, CommonModule, SharedModule],
})
export class MeteoModule {}

