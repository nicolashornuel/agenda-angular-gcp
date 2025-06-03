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

  async ngOnInit(): Promise<void> {
    const { coords }: GeolocationPosition = await this.getCurrentPositionAsync();
    const src = `https://embed.windy.com/embed2.html?lat=${coords.latitude}&lon=${coords.longitude}&zoom=5`;
    this.src = this._sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  private getCurrentPositionAsync(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
  }
}
