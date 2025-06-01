import { Component, Input } from '@angular/core';
import { Forecast } from 'app/meteo/models/meteo.interface';

@Component({
  selector: 'app-forecast-card',
  templateUrl: './forecast-card.component.html',
  styleUrls: ['./forecast-card.component.scss']
})
export class ForecastCardComponent {
  @Input() forecast!:Forecast;
  @Input() view: 'col' | 'row' | 'small' = 'small';

}
