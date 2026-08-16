import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ForecastCardComponent } from './components/forecast-card/forecast-card.component';
import { ForecastChartComponent } from './components/forecast-chart/forecast-chart.component';
import { ForecastMapComponent } from './components/forecast-map/forecast-map.component';
import { PollutantComponent } from './components/pollutant/pollutant.component';
import { PageMeteoComponent } from './page/page-meteo.component';
import { MeteoRoutingModule } from './meteo-routing.module';
import { MeteoService } from './services/meteo.service';

@NgModule({
  declarations: [
    ForecastCardComponent,
    PageMeteoComponent,
    ForecastChartComponent,
    ForecastMapComponent,
    PollutantComponent
  ],
  imports: [MeteoRoutingModule, CommonModule, SharedModule],
  providers: [MeteoService]
})
export class MeteoModule {}

