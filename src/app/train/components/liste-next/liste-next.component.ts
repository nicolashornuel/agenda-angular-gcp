import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '@shared/services/destroy.service';
import { Journey, JourneyDTO, SncfService, STATIONS, StopArea, StopAreaEnum } from 'app/train/services/sncf.service';
import { combineLatest, Observable, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-liste-next',
  templateUrl: './liste-next.component.html',
  styleUrls: ['./liste-next.component.scss']
})
export class ListeNextComponent implements OnInit {
  @Input() liste!: JourneyDTO[];
  @Input() isLoading!: boolean;
  @Input() function!: (sncfService: SncfService, id: string) => Observable<JourneyDTO[]>;
  private sncfService = inject(SncfService);
  private route = inject(ActivatedRoute);
  
  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id') ?? StopArea.BAILLARGUES.id;
    this.function(this.sncfService, id).pipe(take(1)).subscribe(liste => {
      this.liste = liste;
      this.isLoading = false;
    })
  }
}

@Component({
  template: '<app-liste-next [function]="function" class="arrivals"></app-liste-next>',
  styleUrls: ['./liste-next.component.scss']
})
export class ListeArrivalComponent implements OnInit {
  public function!: (sncfService: SncfService, id: string) => Observable<JourneyDTO[]>;

  ngOnInit(): void {
    this.function = (sncfService, id) => sncfService.getArrivals(id)
  }
}

@Component({
  template: '<app-liste-next [function]="function" class="arrivals"></app-liste-next>',
  styleUrls: ['./liste-next.component.scss']
})
export class ListeDepartureComponent implements OnInit {
public function!: (sncfService: SncfService, id: string) => Observable<JourneyDTO[]>;

  ngOnInit(): void {
    this.function = (sncfService, id) => sncfService.getDepartures(id)
  }
}