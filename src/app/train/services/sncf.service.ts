import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SncfService {
  constructor(private http: HttpClient) {}
  /**
   * Les 10 prochains départs
   */
  public getDepartures(station: string): Observable<Journey[]> {
    return this.get(`/coverage/sncf/stop_areas/${station}/departures`).pipe(map(response => response.departures!));
  }
  /**
   * Les 10 prochaines arrivées
   */
  public getArrivals(station: string): Observable<Journey[]> {
    return this.get(`coverage/sncf/stop_areas/${station}/arrivals`).pipe(map(response => response.arrivals!));
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
   * tous les arrêts d'une ligne donnée
   */
  public getJourneys(departure_links_1_id: string): Observable<string[]> {
    return this.get(`coverage/sncf/vehicle_journeys/${departure_links_1_id}`).pipe(
      map(response => response.vehicle_journeys[0].stop_times.map(stop_time => stop_time.stop_point.name))
    );
  }
  /**
   * "https://api.sncf.com/v1/coverage/sncf/disruptions/{disruptions.id}"
   * "https://api.sncf.com/v1/coverage/sncf/disruptions?since=20241025T053400&until=20241125T053400"
   */
  public getDisruptions(since?: string): Observable<NavitiaResponse> {
    return this.get(`coverage/sncf/disruptions`, { since: since ?? undefined });
  }
  /**
   * get Navitia Response https://doc.navitia.io/#api-catalog
   */
  private get(endpoint: string, params?: { [param: string]: any }): Observable<NavitiaResponse> {
    const api = environment.sncfApi;
    const options = {
      headers: {
        Authorization: environment.sncfKey
      },
      params
    };
    return this.http.get<NavitiaResponse>(`${api}/${endpoint}`, options);
  }
}

export interface NavitiaResponse {
  disruptions: any[];
  exceptions: any[];
  departures?: Journey[];
  arrivals?: Journey[];
  vehicle_journeys: { stop_times: { stop_point: { name: string } }[] }[];
}

export interface Journey {
  display_informations: { headsign: string; network: string; direction: string };
  links: { id: string; type: string }[];
  stop_date_time: {
    arrival_date_time: string;
    base_arrival_date_time: string;
    base_departure_date_time: string;
    departure_date_time: string;
  };
  stop_point: { name: string };
}

// https://api.sncf.com/v1/coverage/sncf/places?q=avignon
// liste des gares :https://ressources.data.sncf.com/explore/dataset/liste-des-gares/table/
export enum StopAreaEnum {
  BAILLARGUES = 'Baillargues',
  MONTPELLIER_SAINT_ROCK = 'Montpellier Saint-Roch',
  MONTPELLIER_SUD_DE_FRANCE = 'Montpellier Sud de France',
  NIMES_CENTRE = 'Nîmes Centre',
  NIMES_PONT_DU_GARD = 'Nîmes Pont-du-Gard',
  LYON_PART_DIEU = 'Lyon Part Dieu',
  AVIGNON_CENTRE = 'Avignon Centre',
  AVIGNON_TGV = 'Avignon TGV',
  MARSEILLE_SAINT_CHARLES = 'Marseille Saint-Charles',
  MACON_LOCHE_TGV = 'Mâcon Loché TGV',
  MACON = 'Mâcon'
}
export class StopArea {
  id!: string;
  name!: StopAreaEnum;

  public static readonly BAILLARGUES = {
    id: 'stop_area:SNCF:87773457',
    name: StopAreaEnum.BAILLARGUES
  };
  public static readonly MONTPELLIER_SAINT_ROCK = {
    id: 'stop_area:SNCF:87773002',
    name: StopAreaEnum.MONTPELLIER_SAINT_ROCK
  };
  public static readonly MONTPELLIER_SUD_DE_FRANCE = {
    id: 'stop_area:SNCF:87688887',
    name: StopAreaEnum.MONTPELLIER_SUD_DE_FRANCE
  };
  public static readonly NIMES_CENTRE = {
    id: 'stop_area:SNCF:87775007',
    name: StopAreaEnum.NIMES_CENTRE
  };
  public static readonly NIMES_PONT_DU_GARD = {
    id: 'stop_area:SNCF:87703975',
    name: StopAreaEnum.NIMES_PONT_DU_GARD
  };
  public static readonly LYON_PART_DIEU = {
    id: 'stop_area:SNCF:87723197',
    name: StopAreaEnum.LYON_PART_DIEU
  };
  public static readonly AVIGNON_CENTRE = {
    id: 'stop_area:SNCF:87765008',
    name: StopAreaEnum.AVIGNON_CENTRE
  };
  public static readonly AVIGNON_TGV = {
    id: 'stop_area:SNCF:87318964',
    name: StopAreaEnum.AVIGNON_TGV
  };
  public static readonly MARSEILLE_SAINT_CHARLES = {
    id: 'stop_area:SNCF:87751008',
    name: StopAreaEnum.MARSEILLE_SAINT_CHARLES
  };
  public static readonly MACON_LOCHE_TGV = {
    id: 'stop_area:SNCF:87725705',
    name: StopAreaEnum.MACON_LOCHE_TGV
  };
  public static readonly MACON = {
    id: 'stop_area:SNCF:87725689',
    name: StopAreaEnum.MACON
  };
}
export const STATIONS = [
  {
    id: 'stop_area:SNCF:87773457',
    name: StopAreaEnum.BAILLARGUES
  },
  {
    id: 'stop_area:SNCF:87773002',
    name: StopAreaEnum.MONTPELLIER_SAINT_ROCK
  },
  {
    id: 'stop_area:SNCF:87688887',
    name: StopAreaEnum.MONTPELLIER_SUD_DE_FRANCE
  },
  {
    id: 'stop_area:SNCF:87775007',
    name: StopAreaEnum.NIMES_CENTRE
  },
  {
    id: 'stop_area:SNCF:87703975',
    name: StopAreaEnum.NIMES_PONT_DU_GARD
  },
  {
    id: 'stop_area:SNCF:87723197',
    name: StopAreaEnum.LYON_PART_DIEU
  },
  {
    id: 'stop_area:SNCF:87765008',
    name: StopAreaEnum.AVIGNON_CENTRE
  },
  {
    id: 'stop_area:SNCF:87318964',
    name: StopAreaEnum.AVIGNON_TGV
  },
  {
    id: 'stop_area:SNCF:87751008',
    name: StopAreaEnum.MARSEILLE_SAINT_CHARLES
  },
  {
    id: 'stop_area:SNCF:87725705',
    name: StopAreaEnum.MACON_LOCHE_TGV
  },
  {
    id: 'stop_area:SNCF:87725689',
    name: StopAreaEnum.MACON
  }
];
