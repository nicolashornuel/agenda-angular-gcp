import { Component, Input, OnInit } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { Journey, SncfService, STATIONS, StopArea, StopAreaEnum } from 'app/train/services/sncf.service';
import { combineLatest, switchMap, take, takeUntil } from 'rxjs';

export interface JourneyDTO {
  headsign: string; 
  network: string; 
  direction: string;
  trajetId: string;
  hour: Date;
  delay: number;
  stop_point: string;
}
@Component({
  selector: 'app-liste-next',
  templateUrl: './liste-next.component.html',
  styleUrls: ['./liste-next.component.scss']
})
export class ListeNextComponent implements OnInit {
  arrivals!: JourneyDTO[];
  departures!: JourneyDTO[];
  @Input() stop_area!: StopArea;
  isLoading!: boolean;

  constructor(private sncfService: SncfService, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    this.isLoading = true;
    this.stop_area = StopArea.BAILLARGUES;
    combineLatest([this.sncfService.getArrivals(this.stop_area.id), this.sncfService.getDepartures(this.stop_area.id)])
      .pipe(take(1))
      .subscribe(values => {
        this.arrivals = values[0].map(arrival => this.mapperArrivals(arrival))
        console.log(this.arrivals);
        
        //this.departures = values[1];
        this.isLoading = false;
      });
  }

  private mapperArrivals(journey: Journey): any {
    return {
      stop_point: journey.stop_point.name,
      ...journey.display_informations,
      hour: this.convertDate(journey.stop_date_time.base_arrival_date_time),
      trajetId: journey.links[1].id,
      delay: this.getDifference(
        journey.stop_date_time.base_arrival_date_time,
        journey.stop_date_time.arrival_date_time
      )
    };
  }

  public getDifference(theorique: string, reel: string): number {
    const dateTheorique = this.convertDate(theorique);
    const dateReel = this.convertDate(reel);
    const diffTime = Math.abs(dateTheorique.getTime() - dateReel.getTime());
    return diffTime;
  }

  public convertDate(apiDate: string): Date {
    const utcDate = apiDate.split('');
    utcDate.splice(4, 0, '-');
    utcDate.splice(7, 0, '-');
    utcDate.splice(13, 0, ':');
    utcDate.splice(16, 0, ':');
    return new Date(utcDate.join(''));
  }
}
