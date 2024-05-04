import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {DestroyService} from '@shared/services/destroy.service';
import {StationsEnum} from 'app/musique/enums/radioFrance.enum';
import {Brand, BrandDTO, Grid, SongDTO} from 'app/musique/models/radioFrance.interface';
import {AudioService} from 'app/musique/services/audio.service';
import {RadioTransformService} from 'app/musique/services/radio-transform.service';
import {RadioUtilService} from 'app/musique/services/radio-util.service';
import {RadioService} from 'app/musique/services/radio.service';
import {TabResultService} from 'app/musique/services/tab-result.service';
import {Subscription, interval, timer} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-radio-player',
  templateUrl: './radio-player.component.html',
  styleUrls: ['./radio-player.component.scss']
})
export class RadioPlayerComponent implements AfterViewInit {
  @ViewChild('track') trackElt!: ElementRef<HTMLElement>;
  @ViewChild('player') player!: ElementRef;
  @ViewChild('audio') audio!: ElementRef;
  @ViewChild('popover') popover!: ElementRef;
  public isPlaying = false;

  public brandDTO: BrandDTO = {
    value: 'https://icecast.radiofrance.fr/fip-midfi.mp3?id=openapi', //"https://icecast.radiofrance.fr/fip-midfi.mp3?id=radiofrance
    viewValue: 'FIP'
  };
  private station!: StationsEnum;
  public song?: SongDTO;
  public grid!: SongDTO[];
  public secondsLeft = 0;
  public minutesLeft = 0;
  private msPerSecond = 1000;
  private msPerMinute = 60 * 1000;
  private msPerHour = 60 * 60 * 1000;

  private ticker$ = new Subscription();

  constructor(
    private radio: RadioService,
    private transform: RadioTransformService,
    private util: RadioUtilService,
    private titleService: Title,
    private audioService: AudioService,
    private destroy$: DestroyService,
    private tabService: TabResultService
  ) {}

  ngAfterViewInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.station = StationsEnum.FIP;
    this.getBrand();
    this.getLive(0);
  }

  private getBrand(): void {
    this.radio
      .subscribeBrand(this.station)
      .pipe(take(1))
      .subscribe((brand: Brand) => {
        this.brandDTO = this.transform.brandMapper(brand);
        this.setAudio();
      });
  }

  private getGrid(): void {
    this.radio
      .subscribeGrid(this.station)
      .pipe(take(1))
      .subscribe((grid: Grid) => {
        this.grid = this.transform.gridMapper(grid.grid);
      });
  }

  private getLive(delay: number): void {
    timer(delay).subscribe(async () => {
      const result = await this.radio.getLive(this.station).refetch();
      this.song = result.data.live ? this.transform.factory(result.data) : undefined;
      if (this.song) {
        this.titleService.setTitle([this.song.artist, this.song.title].join(' '));
        this.setTicker(this.song);
        this.setAnimation(this.song);
        this.getGrid();
        this.getLive(this.util.delay(this.song.end) + 1000);
      } else {
        this.getLive(2000);
      }
    });
  }

  private setTicker(song: SongDTO): void {
    this.ticker$.unsubscribe();
    this.ticker$ = interval(1000).subscribe(() => {
      const timeDifference = song.end * 1000 - new Date().getTime();
      if (timeDifference > 0) {
        this.minutesLeft = Math.floor((timeDifference % this.msPerHour) / this.msPerMinute);
        this.secondsLeft = Math.floor((timeDifference % this.msPerMinute) / this.msPerSecond);
      }
    });
  }

  private setAnimation(song: SongDTO): void {
    timer(500).subscribe(() => {
      this.util.setAnimation(song.artist!, this.trackElt.nativeElement.children[0]);
      this.util.setAnimation(song.title, this.trackElt.nativeElement.children[1]);
    });
  }

  public onSearch(): void {
    this.tabService.set$(this.song!.artist);
  }

  public searchByHistory(song: SongDTO): void {
    this.popover.nativeElement.click();
    this.tabService.set$(song.artist);
  }

  public toggleWindowDesktop(): void {
    if (this.song?.title) {
      const widthOfWindow = this.player.nativeElement.style.width;
      this.player.nativeElement.style.width = widthOfWindow === '420px' ? '102px' : '420px';
    }
  }

  private setAudio(): void {
    this.secondsLeft = 0;
    this.minutesLeft = 0;
    timer(500).subscribe(() => (this.audio.nativeElement.volume = 0.1));
    this.audioService.getIsPlaying$.pipe(takeUntil(this.destroy$)).subscribe((isPlaying: boolean) => {
      this.isPlaying = isPlaying;
      if (this.isPlaying) this.audioService.set$(this.audio.nativeElement);
      this.isPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
    });
  }

  public onTooglePlay(): void {
    this.isPlaying ? this.audioService.setIsPlaying(false) : this.audioService.setIsPlaying(true);
  }

  public onVolume(direction: string): void {
    const volume = this.audio.nativeElement.volume;
    if (volume <= 1 && volume >= 0) {
      this.audio.nativeElement.volume += direction === 'up' ? 0.1 : -0.1;
    }
  }
}
