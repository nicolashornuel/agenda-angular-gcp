import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-forecast-map',
  templateUrl: './forecast-map.component.html',
  styleUrls: ['./forecast-map.component.scss']
})
export class ForecastMapComponent implements OnInit{
public src?: SafeResourceUrl;
private _sanitizer = inject(DomSanitizer);
private params = {
  zoom: 5,
  detail: true,
  message: true,
  type: 'map', //  map | forecast
  location: 'coordinates',
  metricRain: 'mm',
  metricTemp: '°C',
  metricWind: 'km/h',
  overlay: 'wind',
  product: 'ecmwf',
  level: 'surface',
};

  async ngOnInit(): Promise<void> {
    const { coords }: GeolocationPosition = await this.getCurrentPositionAsync();
    let src = `https://embed.windy.com/embed2.html?`;
    const params = new URLSearchParams(
      Object.entries(this.params).reduce((acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    );
    params.set('detailLat', coords.latitude.toFixed(3));
    params.set('detailLon', coords.longitude.toFixed(3));
    src += `&${params.toString()}`;
    this.src = this._sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  private getCurrentPositionAsync(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
  }
}


