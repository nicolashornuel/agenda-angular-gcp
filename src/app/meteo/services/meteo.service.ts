import { Injectable } from '@angular/core';
import { City, Forecast } from '../models/meteo.interface';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/';
  private apiKey = '35595a57302ef787310ab42e25caee5b';

  public async getMeteo() {
    const { coords }: GeolocationPosition = await this.getCurrentPositionAsync();
    return this.fetchApi(coords);
  }

  private getCurrentPositionAsync(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
  }

  private async fetchApi({ latitude, longitude }: { latitude: number; longitude: number }): Promise<{city: City, list: Forecast[]}> {
    const response = await fetch(
      `${this.apiUrl}forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=fr`
    );
    return response.json();
  }
}
