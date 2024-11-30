import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataSelect } from '@shared/models/tableSet.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { JourneyDTO, SncfService, STATIONS, StopArea } from 'app/train/services/sncf.service';
import { interval, Observable, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-liste-next',
  templateUrl: './liste-next.component.html',
  styleUrls: ['./liste-next.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListeNextComponent implements OnInit {
  @Input() function!: (sncfService: SncfService, id: string) => Observable<JourneyDTO[]>;
  @Input() route!: string;
  public liste!: JourneyDTO[];
  public isLoading!: boolean;
  public isTimeDisplay!: boolean;
  public select = new DataSelect<StopArea>({key: 'key', title: 'choix de la gare'}, {key: StopArea.BAILLARGUES}, Object.values(StopArea));

  private sncfService = inject(SncfService);
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = inject(DestroyService);
  private router = inject(Router);
  
  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe((param: ParamMap) => {
      this.select.value = Object.values(StopArea).find(any => any['id'] === param.get('id')) ?? StopArea.BAILLARGUES
      this.isLoading = false;
      this.initData();
    })
  }

  private initData(): void {
    this.isLoading = true;
    this.function(this.sncfService, this.select.value.id).pipe(take(1)).subscribe(liste => {
      this.liste = liste;
      console.log(this.liste);
      this.initInterval();
      this.isLoading = false;
    })
  }

  public onSelectChange(): void {
    this.router.navigate([`/train/${this.route}/`, this.select.value.id]);
  }

  private initInterval() {
    interval(5000).pipe(takeUntil(this.destroy$)).subscribe(() => this.isTimeDisplay = !this.isTimeDisplay )
  }
}

@Component({
  template: '<app-liste-next [function]="function" [ngClass]="route" [route]="route"></app-liste-next>',
  styleUrls: ['./liste-next.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListeArrivalComponent {
  public function = (sncfService: SncfService, id: string) => sncfService.getArrivals(id);
  public route = "arrivals";
}

@Component({
  template: '<app-liste-next [function]="function" [ngClass]="route" [route]="route"></app-liste-next>',
  styleUrls: ['./liste-next.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListeDepartureComponent {
public function = (sncfService: SncfService, id: string) => sncfService.getDepartures(id);
public route = "departures";
}