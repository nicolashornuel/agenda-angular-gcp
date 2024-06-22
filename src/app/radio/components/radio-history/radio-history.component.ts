import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RightBarIsOpenedService } from '@shared/services/shared.observable.service';
import { TabResultService } from 'app/musique/services/musique.observable.service';
import { StationsEnum } from 'app/radio/enums/radioFrance.enum';
import { SongDTO, Grid } from 'app/radio/models/radioFrance.interface';
import { RadioTransformService } from 'app/radio/services/radio-transform.service';
import { RadioService } from 'app/radio/services/radio.service';
import { Subscription, interval, take, timer } from 'rxjs';

@Component({
  selector: 'app-radio-history',
  templateUrl: './radio-history.component.html',
  styleUrls: ['./radio-history.component.scss']
})
export class RadioHistoryComponent implements AfterViewInit {

  @Output() output = new EventEmitter<void>();
  public song?: SongDTO;
  public grid?: SongDTO[];
  public secondsLeft = 0;
  public minutesLeft = 0;
  public isOpen: boolean = false;
  private readonly STATION = StationsEnum.FIP;
  private ticker$ = new Subscription();

  constructor(
    private radioService: RadioService,
    private transform: RadioTransformService,
    private titleService: Title,
    private tabService: TabResultService,
    private rightBarIsOpenedService: RightBarIsOpenedService
  ) {}

  ngAfterViewInit(): void {
    this.getLive(0);
  }
  
  public onSearch(song: SongDTO): void {
    this.output.emit();
    this.tabService.set$(song.artist);
    this.rightBarIsOpenedService.set$(false);
  }

  public onToggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  private getGrid(): void {
    this.radioService
      .subscribeGrid(this.STATION)
      .pipe(take(1))
      .subscribe((grid: Grid) => (this.grid = this.transform.gridMapper(grid.grid)));
  }

  private getLive(delay: number): void {
    timer(delay).pipe(take(1)).subscribe(async () => {
      const result = await this.radioService.getLive(this.STATION).refetch();
      this.song = result.data.live ? this.transform.factory(result.data) : undefined;
      if (this.song) {
        this.titleService.setTitle([this.song.artist, this.song.title].join(' '));
        this.setTicker(this.song);
        this.getGrid();
        this.getLive(this.delay(this.song.end) + 1000);
      } else {
        this.getLive(2000);
      }
    });
  }

  private setTicker(song: SongDTO): void {
    const msPerSecond = 1000;
    const msPerMinute = 60 * 1000;
    const msPerHour = 60 * 60 * 1000;
    this.ticker$.unsubscribe();
    this.ticker$ = interval(msPerSecond).subscribe(() => {
      const timeDifference = song.end * msPerSecond - new Date().getTime();
      if (timeDifference > 0) {
        this.minutesLeft = Math.floor((timeDifference % msPerHour) / msPerMinute);
        this.secondsLeft = Math.floor((timeDifference % msPerMinute) / msPerSecond);
      }
    });
  }

  private delay(end: number): number {
    const now: number = Math.floor(new Date().getTime());
    return Math.abs(end * 1000 - now);
  }
  
}
