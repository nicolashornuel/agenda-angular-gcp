import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { IsMobileService } from '@shared/services/shared.observable.service';
import { RadioPlayingService } from '@core/services/core.observable.service';
import { AudioNodeController } from 'app/radio/abstracts/audioDirective.abstract';
import { AudioVolumeService } from 'app/radio/services/audio.observable.service';

import { combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'app-audio-node-radio',
  templateUrl: './audio-node-radio.component.html',
  styleUrls: ['./audio-node-radio.component.scss']
})
export class AudioNodeRadioComponent extends AudioNodeController implements AfterViewInit {
  @ViewChild('audio') audio!: ElementRef;
  public isPlaying: boolean = false;
  public radioList = [
    {
      name: 'FIP',
      value: 'https://icecast.radiofrance.fr/fip-midfi.mp3?id=openapi'
    },
    {
      name: 'Bassdrive',
      value: 'http://chi.bassdrive.co/;stream/1'
    }
  ];

  public radioSelected = this.radioList[0];
  public isMobile!: boolean;

  constructor(
    private volumeService: AudioVolumeService,
    private destroy$: DestroyService,
    private playingService: RadioPlayingService,
    private isMobileService: IsMobileService,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
    this.listen();
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
