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
  public async getPollution(): Promise<any> {
    const { coords }: GeolocationPosition = await this.getCurrentPositionAsync();
    const response = await fetch(
      `${this.apiUrl}air_pollution?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.apiKey}&lang=fr`
    );
    const pollutionData = await response.json();


    let Pollutants = [];
    // Example usage of the level methods
    const components = pollutionData.list[0].components

    for (const key in components) {
      if (Object.prototype.hasOwnProperty.call(components, key)) {
        const element = components[key];
        const abaqueKey = key as keyof typeof this.abaque;
        Pollutants.push({
          name: key,
          value: element,
          level: this.getPollutionLevel(element, Object.values(this.abaque[abaqueKey].range)),
          description: this.abaque[abaqueKey].description,
          wiki: this.abaque[abaqueKey].wiki,
        });
      }
    }
  
    
    return Pollutants;
  }

  private readonly GOOD = {label:'Bien', class: 'good'};
  private readonly FAIR = {label:'Équitable', class: 'fair'};
  private readonly MODERATE = {label:'Modéré', class: 'moderate'};
  private readonly POOR = {label:'Élevé', class: 'poor'};
  private readonly VERY_POOR = {label:'Très élevé', class: 'very_poor'};

  private abaque = {
    co: {range: [4400, 9400, 12400, 15400], description: "monoxyde de carbone", wiki: "Monoxyde de carbone"},
    nh3: {range: [0, 0, 0, 200], description: "ammoniac", wiki: "Ammoniac"},
    no: {range: [0, 0, 0, 100], description: "monoxyde d'azote", wiki: "Monoxyde d'azote"},
    no2: {range: [40, 70, 150, 200], description: "dioxyde d'azote", wiki: "Dioxyde d'azote"},
    o3: {range: [60, 100, 140, 180], description: "ozone", wiki: "Ozone"},
    pm2_5: {range: [10, 25, 50, 75], description: "particules fines PM2.5", wiki: "Particules en suspension"},
    pm10: {range: [20, 50, 100, 200], description: "particules fines PM10", wiki: "Particules en suspension"},
    so2: {range: [20, 80, 250, 350], description: "dioxyde de soufre", wiki: "Dioxyde de soufre"},
  };

  private getPollutionLevel(component: number, list: number[]): {label: string, class: string} {
    if (component <= list[0]) return this.GOOD;
    if (component <= list[1]) return this.FAIR;
    if (component <= list[2]) return this.MODERATE;
    if (component <= list[3]) return this.POOR;
    return this.VERY_POOR;
  }


}
