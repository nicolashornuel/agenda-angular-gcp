import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SncfService {

  constructor(private http: HttpClient) {}
  /**
   * Les 10 prochains départs
   */
  public getDepartures(station: string): Observable<NavitiaResponse> {
    return this.get(`/coverage/sncf/stop_areas/${station}/departures`);
  }
  /**
   * Les 10 prochaines arrivées
   */
  public getArrivals(station: string): Observable<NavitiaResponse> {
    return this.get(`coverage/sncf/stop_areas/${station}/arrivals`);
  }
  /**
   * departures grouped by terminus
   */
  public getByTerminus(station: string): Observable<NavitiaResponse> {
    return this.get(`coverage/sncf/stop_areas/${station}/terminus_schedules`);
  }
  /**
   * departures grouped by route
   */
  public getByRoute(station: string): Observable<NavitiaResponse> {
    return this.get(`coverage/sncf/stop_areas/${station}/stop_schedules`);
  }
  /**
   * departures grouped by route
   */
  public getJourneys(departure_links_1_id: string): Observable<NavitiaResponse> {
    return this.get(`coverage/sncf/vehicle_journeys/${departure_links_1_id}`);
  }
  /**
   * get Navitia Response https://doc.navitia.io/#api-catalog
   */
  private get(endpoint: string): Observable<NavitiaResponse> {
    const api = environment.sncfApi;
    const options = {
      headers: {
        Authorization: environment.sncfKey
      }
    };
    return this.http.get<NavitiaResponse>(`${api}/${endpoint}`, options);
  }
}

export interface NavitiaResponse {
  disruptions: any[];
  exceptions: any[];
  departures?: Journey[];
  arrivals?: Journey[];
}

export interface Journey {
  display_informations: { headsign: string; network: string; direction: string };
  vehicle_journey: string;
  stop_date_time: {
    arrival_date_time: string;
    base_arrival_date_time: string;
    base_departure_date_time: string;
    departure_date_time: string;
  };
  stop_point: { name: string };
}

// https://api.sncf.com/v1/coverage/sncf/places?q=avignon
export const STATIONS = [
  {
    id: 'stop_area:SNCF:87773457',
    name: 'Baillargues'
  },
  {
    id: 'stop_area:SNCF:87773002',
    name: 'Montpellier Saint-Roch'
  },
  {
    id: 'stop_area:SNCF:87688887',
    name: 'Montpellier Sud de France'
  },
  {
    id: 'stop_area:SNCF:87775007',
    name: 'Nîmes Centre'
  },
  {
    id: 'stop_area:SNCF:87703975',
    name: 'Nîmes Pont-du-Gard'
  },
  {
    id: 'stop_area:SNCF:87723197',
    name: 'Lyon Part Dieu'
  },
  {
    id: 'stop_area:SNCF:87765008',
    name: 'Avignon Centre'
  },
  {
    id: 'stop_area:SNCF:87318964',
    name: 'Avignon TGV'
  },
  {
    id: 'stop_area:SNCF:87751008',
    name: 'Marseille Saint-Charles'
  },
  {
    id: 'stop_area:SNCF:87725705',
    name: 'Mâcon Loché TGV'
  },
  {
    id: 'stop_area:SNCF:87725689',
    name: 'Mâcon'
  }
];
