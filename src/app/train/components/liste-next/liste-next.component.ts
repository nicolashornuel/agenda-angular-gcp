import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataSelect } from '@shared/models/fieldSet.model';
import { DestroyService } from '@shared/services/destroy.service';
import { JourneyDTO, StopArea } from 'app/train/models/sncf.model';
import { SncfService } from 'app/train/services/sncf.service';
import { interval, Observable, Subscription, take, takeUntil } from 'rxjs';

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
  public select = new DataSelect<StopArea>({ name: 'choix de la gare' }, Object.values(StopArea));
  public hasNext!: boolean;
  public hasPrev!: boolean;
  private sncfService = inject(SncfService);
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = inject(DestroyService);
  private router = inject(Router);

  private interval$?: Subscription;

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe((param: ParamMap) => {
      this.select.value = Object.values(StopArea).find(any => any['value'] === param.get('id')) ?? StopArea.BAILLARGUES;
      this.isLoading = false;
      this.initData();
    });
    this.enTest();
  }

  private enTest(): void {
    /* this.sncfService
      .getByRoute(StopArea.BAILLARGUES.value)
      .pipe(take(1))
      .subscribe(liste => {
        console.log(liste);
      }); */
    /* this.sncfService
      .getByTerminus(StopArea.BAILLARGUES.value)
      .pipe(take(1))
      .subscribe(liste => {
        console.log(liste);
      }); */
  }

  private initData(): void {
    this.isLoading = true;
    this.function(this.sncfService, this.select.value!.value)
      .pipe(take(1))
      .subscribe(liste => {
        this.liste = liste;
        this.interval$?.unsubscribe();
        this.initInterval();
        this.isLoading = false;
      });
  }

  public onSelectChange(): void {
    this.router.navigate([`/train/${this.route}/`, this.select.value!.value]);
  }

  private initInterval() {
    this.interval$ = interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.isTimeDisplay = !this.isTimeDisplay));
  }
}

@Component({
  template: '<app-liste-next [function]="function" [ngClass]="route" [route]="route"></app-liste-next>',
  styleUrls: ['./liste-next.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListeArrivalComponent {
  public function = (sncfService: SncfService, id: string) => sncfService.getArrivals(id);
  public route = 'arrivals';
}

@Component({
  template: '<app-liste-next [function]="function" [ngClass]="route" [route]="route"></app-liste-next>',
  styleUrls: ['./liste-next.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListeDepartureComponent {
  public function = (sncfService: SncfService, id: string) => sncfService.getDepartures(id);
  public route = 'departures';
}
