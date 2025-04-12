import { Component, OnInit } from '@angular/core';
import { City, Forecast } from '../models/meteo.interface';
import { MeteoService } from '../services/meteo.service';

@Component({
  selector: 'app-page-meteo',
  templateUrl: './page-meteo.component.html',
  styleUrls: ['./page-meteo.component.scss']
})
export class PageMeteoComponent implements OnInit {
  public loading = false;
  public city!: City;
  public forecasts: Forecast[] = [];

  constructor(private meteoService: MeteoService) {}

  ngOnInit(): void {
    this.loading = true;
    this.meteoService.getMeteo().then(({ city, list }) => {
      this.city = city;
      this.forecasts = list;
      this.loading = false;
    });
  }
}