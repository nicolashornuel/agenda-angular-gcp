import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable, filter, map, tap } from 'rxjs';
import { JourneyDTO, NavitiaResponse, Disruption, DisruptionDTO, ScheduleDTO, Schedule } from '../models/sncf.model';

@Injectable({
  providedIn: 'root'
})
export class SncfService {
  constructor(private http: HttpClient, private datePipe: DatePipe) {}
  /**
   * Les 10 prochains départs
   */
  public getDepartures(station: string): Observable<JourneyDTO[]> {
    const params: { start_page?: number; count?: number } = { count: 200 };
    return this.get(`/coverage/sncf/stop_areas/${station}/departures`, params).pipe(
      map(response => this.mapperDepartures(response))
    );
  }
  /**
   * Les 10 prochaines arrivées
   */
  public getArrivals(station: string): Observable<JourneyDTO[]> {
    const params: { start_page?: number; count?: number } = { count: 200 };
    return this.get(`coverage/sncf/stop_areas/${station}/arrivals`, params).pipe(
      map(response => this.mapperArrivals(response))
    );
  }
  /**
   * departures grouped by terminus
   */
  public getByTerminus(station: string): Observable<ScheduleDTO[]> {
    return this.get(`coverage/sncf/stop_areas/${station}/terminus_schedules`).pipe(
      map(response => this.mapperSchedules(response.terminus_schedules!))
    );
  }
  /**
   * departures grouped by route
   */
  public getByRoute(station: string): Observable<ScheduleDTO[]> {
    return this.get(`coverage/sncf/stop_areas/${station}/stop_schedules`).pipe(
      map(response => this.mapperSchedules(response.stop_schedules!))
    );
  }
  /**
   * tous les arrêts d'une ligne donnée
   */
  public getJourneys(vehicle_journeyId: string): Observable<string[]> {
    return this.get(`coverage/sncf/vehicle_journeys/${vehicle_journeyId}`).pipe(
      map(response => response.vehicle_journeys[0].stop_times.map(stop_time => stop_time.stop_point.name))
    );
  }
  /**
   * get disruption by id
   */
  public getDisruption(id: string): Observable<DisruptionDTO> {
    //return this.get(`coverage/sncf/disruptions/${id}`).pipe(
    return this.get(`coverage/sncf/disruptions/`).pipe(
      filter(response => response.disruptions && response.disruptions.length > 0),
      tap(response => console.log('Disruption response:', response)),
      map(response => this.mapperDisruption(response.disruptions[0]))
    );
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

  private mapperSchedules(stop_schedules: Schedule[]): ScheduleDTO[] {
    return stop_schedules!.map(schedule => ({
      direction: schedule.display_informations.direction,
      headsign: schedule.display_informations.headsign,
      network: schedule.display_informations.network,
      date_times: schedule.date_times.map(date_time => ({
        baseHour: this.formatBaseDate(date_time.base_date_time),
        trajetId: date_time.links.filter(link => link.type === 'vehicle_journey')[0].id
      })),
      routeId: schedule.route.id,
      lineId: schedule.route.line.id,
      networkId: schedule.route.line.network.id
    }));
  }
  private mapperArrivals(response: NavitiaResponse): JourneyDTO[] {    
    return response.arrivals!.map(arrival => ({
      disruptionId: arrival.display_informations.links[0]?.id,
      ...arrival.display_informations,
      baseHour: this.formatBaseHour(
        arrival.stop_date_time.base_arrival_date_time ?? arrival.stop_date_time.arrival_date_time
      ),
      trajetId: arrival.links[1].id,
      delay: this.getDifference(
        arrival.stop_date_time.base_arrival_date_time ?? arrival.stop_date_time.arrival_date_time,
        arrival.stop_date_time.arrival_date_time
      )
    }));
  }

  private mapperDepartures(response: NavitiaResponse): JourneyDTO[] {
    return response.departures!.map(departure => ({
      disruptionId: departure.display_informations.links[0]?.id,
      ...departure.display_informations,
      baseHour: this.formatBaseHour(
        departure.stop_date_time.base_departure_date_time ?? departure.stop_date_time.departure_date_time
      ),
      trajetId: departure.links[1].id,
      delay: this.getDifference(
        departure.stop_date_time.base_departure_date_time ?? departure.stop_date_time.departure_date_time,
        departure.stop_date_time.departure_date_time
      )
    }));
  }

  private mapperDisruption(disruption: Disruption): DisruptionDTO {
    return {
      status: disruption.status,
      message: disruption.messages ? disruption.messages[0].text : '',
      severityEffect: disruption.severity.effect,
      severityName: disruption.severity.name
    };
  }

  private getDifference(theorique: string, reel: string): string {
    const dateTheorique = this.convertDate(theorique);
    const dateReel = this.convertDate(reel);
    const minuteDelay = Math.abs(dateTheorique.getTime() - dateReel.getTime()) / 60000;
    if (minuteDelay >= 60) return `retard ${Math.floor(minuteDelay / 60)}h${minuteDelay % 60}`;
    if (minuteDelay > 0) return `retard ${minuteDelay}min`;
    return "à l'heure";
  }

  private convertDate(apiDate: string): Date {
    const utcDate = apiDate.split('');
    utcDate.splice(4, 0, '-');
    utcDate.splice(7, 0, '-');
    utcDate.splice(13, 0, ':');
    utcDate.splice(16, 0, ':');
    return new Date(utcDate.join(''));
  }

  private formatBaseHour(apiDate: string): string {
    const date = this.convertDate(apiDate);
    return this.datePipe.transform(date, 'HH:mm')!.replace(':', 'h');
  }
  private formatBaseDate(apiDate: string): string {
    const date = this.convertDate(apiDate);
    return this.datePipe.transform(date, 'EE d MMM y à HH:mm')!.replace(':', 'h');
  }
}
