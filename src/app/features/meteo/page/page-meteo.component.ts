import { Component, OnInit } from '@angular/core';
import { City, Forecast } from '../models/meteo.interface';
import { MeteoService } from '../services/meteo.service';
import { IsMobileService } from '@shared/services/shared.observable.service';

@Component({
  selector: 'app-page-meteo',
  templateUrl: './page-meteo.component.html',
  styleUrls: ['./page-meteo.component.scss']
})
export class PageMeteoComponent implements OnInit {
  public loading = false;
  public city!: City;
  public forecasts: Forecast[] = [];
  public pollutants: any;

  constructor(private meteoService: MeteoService, public isMobileService: IsMobileService) {}

  ngOnInit(): void {
    this.loading = true;
 
    Promise.all([this.meteoService.getMeteo(), this.meteoService.getPollution()]).then(([{ city, list }, pollutants]) => {
      this.city = city;
      this.forecasts = list;      
      this.pollutants = pollutants;
      this.loading = false;
    });

  }
}