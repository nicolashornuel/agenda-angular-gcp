import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { IsMobileService } from '@shared/services/shared.observable.service';
import { AudioNodeController } from 'app/radio/abstracts/audioDirective.abstract';
import { AudioVolumeService, RadioPlayingService, StationRadioService } from 'app/radio/services/audio.observable.service';

import { combineLatest, takeUntil } from 'rxjs';
import { StationSelectable, Stations } from 'app/radio/enums/radioFrance.enum';

@Component({
  selector: 'app-audio-node-radio',
  templateUrl: './audio-node-radio.component.html',
  styleUrls: ['./audio-node-radio.component.scss']
})
export class AudioNodeRadioComponent extends AudioNodeController implements AfterViewInit {
  @ViewChild('audio') audio!: ElementRef;
  public isPlaying: boolean = false;
  public radioList: StationSelectable[] = Stations;
  public radioSelected = this.radioList[0];
  public isMobile!: boolean;

  constructor(
    private volumeService: AudioVolumeService,
    private destroy$: DestroyService,
    private playingService: RadioPlayingService,
    private isMobileService: IsMobileService,
    private stationRadioService: StationRadioService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
    this.listen();
  }

  public onSelectStation() {
    this.stationRadioService.set$(this.radioSelected.id);

    if (this.isPlaying) {
      const player = this.audio.nativeElement;

      const playAudio = () => {
        player.play().catch((err: any) => console.error('Erreur play:', err));
        player.removeEventListener('canplay', playAudio);
      };
    
      player.addEventListener('canplay', playAudio);
      player.load();
    }

  }

  protected override initNode(): void {
    this.sourceNode = new MediaElementAudioSourceNode(this.audioCtx, { mediaElement: this.audio.nativeElement });
    this.sourceService.set$(this.sourceNode); 
  }

  protected override connectNode(): void {
    this.sourceNode.connect(this.gainNode).connect(this.audioCtx.destination);
  }

  private listen(): void {
    combineLatest([this.volumeService.get$, this.playingService.get$, this.isMobileService.get$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        this.audio.nativeElement.volume = values[0];
        if (this.isPlaying) this.setRadioPlaying(values[1]);
        this.isMobile = values[2]!;
      });
  }

  private setRadioPlaying(play: boolean): void {
    this.isPlaying = play;
    this.isPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
  }

  onTooglePlay(): void {
    this.setRadioPlaying(!this.isPlaying);
    this.playingService.set$(this.isPlaying);
  }

}
