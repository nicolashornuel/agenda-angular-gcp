import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SncfService {
  constructor(private http: HttpClient, private datePipe: DatePipe) {}
  /**
   * Les 10 prochains départs
   */
  public getDepartures(station: string): Observable<JourneyDTO[]> {
    return this.get(`/coverage/sncf/stop_areas/${station}/departures`).pipe(
      map(response => this.mapperDepartures(response))
    );
  }
  /**
   * Les 10 prochaines arrivées
   */
  public getArrivals(station: string): Observable<JourneyDTO[]> {
    return this.get(`coverage/sncf/stop_areas/${station}/arrivals`).pipe(
      map(response => this.mapperArrivals(response))
    );
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
   * https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area:SNCF:87773457/arrivals
   * => response.disruptions.impacted_objects[0].impacted_stops.filter(impacted_stop => impacted_stop.stop_point.id == "stop_point:SNCF:87773457:Train")
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

  public mapperArrivals(response: NavitiaResponse): JourneyDTO[] {
    return response.arrivals!.map(arrival => ({
      disruptions: this.mapperArrivalDisruptions(response.disruptions, arrival.stop_point),
      stop_point: arrival.stop_point,
      ...arrival.display_informations,
      baseHour: this.formatBaseHour(arrival.stop_date_time.base_arrival_date_time),
      trajetId: arrival.links[1].id,
      delay: this.getDifference(arrival.stop_date_time.base_arrival_date_time, arrival.stop_date_time.arrival_date_time)
    }));
  }

  public mapperDepartures(response: NavitiaResponse): JourneyDTO[] {
    return response.departures!.map(departure => ({
      disruptions: this.mapperDepartureDisruptions(response.disruptions, departure.stop_point),
      stop_point: departure.stop_point,
      ...departure.display_informations,
      baseHour: this.formatBaseHour(departure.stop_date_time.base_departure_date_time),
      trajetId: departure.links[1].id,
      delay: this.getDifference(
        departure.stop_date_time.base_departure_date_time,
        departure.stop_date_time.departure_date_time
      )
    }));
  }

  public mapperArrivalDisruptions(disruptions: Disruption[], stop_point: Stop_point): any {
    return disruptions[0].impacted_objects[0].impacted_stops.filter(impacted_stop => impacted_stop.stop_point.id === stop_point.id).map(impacted_stop => ({
      status: impacted_stop.arrival_status,
      cause: impacted_stop.cause,
      isDetour: impacted_stop.is_detour,
      test: impacted_stop
    }))
  }
  public mapperDepartureDisruptions(disruptions: Disruption[], stop_point: Stop_point): any {
    return disruptions[0].impacted_objects[0].impacted_stops.filter(impacted_stop => impacted_stop.stop_point.id === stop_point.id).map(impacted_stop => ({
      status: impacted_stop.departure_status,
      cause: impacted_stop.cause,
      isDetour: impacted_stop.is_detour,
    }))
  }

  public getDifference(theorique: string, reel: string): string {
    const dateTheorique = this.convertDate(theorique);
    const dateReel = this.convertDate(reel);
    const minuteDelay = Math.abs(dateTheorique.getTime() - dateReel.getTime()) / 60000;
    if (minuteDelay >= 60) return `retard ${Math.floor(minuteDelay / 60)}h${minuteDelay % 60}`;
    if (minuteDelay > 0) return `retard ${minuteDelay}min`;
    return "à l'heure";
  }

  public convertDate(apiDate: string): Date {
    const utcDate = apiDate.split('');
    utcDate.splice(4, 0, '-');
    utcDate.splice(7, 0, '-');
    utcDate.splice(13, 0, ':');
    utcDate.splice(16, 0, ':');
    return new Date(utcDate.join(''));
  }

  public formatBaseHour(apiDate: string): string {
    const date = this.convertDate(apiDate);
    return this.datePipe.transform(date, 'HH:mm')!.replace(':', 'h');
  }
}

export interface NavitiaResponse {
  disruptions: Disruption[];
  exceptions: any[];
  departures?: Journey[];
  arrivals?: Journey[];
  vehicle_journeys: { stop_times: { stop_point: Stop_point }[] }[];
}

export interface Disruption {
  messages: { text: string }[];
  severity: { effect: string; name: string };
  status: string;
  impacted_objects: {
    impacted_stops: {
      amended_arrival_time: string;
      amended_departure_time: string;
      arrival_status: string;
      base_arrival_time: string;
      base_departure_time: string;
      cause: string;
      is_detour: boolean;
      departure_status: string;
      stop_point: Stop_point;
    }[];
  }[];
}

export interface Stop_point {
  id: string; 
  name: string;
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
  stop_point: Stop_point;
}

export interface JourneyDTO {
  disruptions: any;
  headsign: string;
  network: string;
  direction: string;
  trajetId: string;
  baseHour: string;
  delay: string;
  stop_point: Stop_point;
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
