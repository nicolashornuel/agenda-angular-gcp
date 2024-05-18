import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { RadioPlayingService } from 'app/core/services/core.observable.service';
import { AudioNodeController } from 'app/radio/abstracts/audioDirective.abstract';
import { AudioVolumeService } from 'app/radio/services/audio.observable.service';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-audio-node-radio',
  templateUrl: './audio-node-radio.component.html',
  styleUrls: ['./audio-node-radio.component.scss']
})
export class AudioNodeRadioComponent extends AudioNodeController implements AfterViewInit {
  @ViewChild('audio') audio!: ElementRef;
  @ViewChild('popover') popoverBtn!: ElementRef;
  private source!: MediaElementAudioSourceNode;
  public gainRadio?: GainNode;
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

  constructor(
    private volumeService: AudioVolumeService,
    private destroy$: DestroyService,
    private playingService: RadioPlayingService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
    this.listen();
  }

  protected override initNode(): void {
    this.source = new MediaElementAudioSourceNode(this.audioCtx, {mediaElement: this.audio.nativeElement});
    this.gainRadio = new GainNode(this.audioCtx);
  }

  protected override connectNode(): void {
    this.source.connect(this.sourceNode).connect(this.audioCtx.destination);
  }
  
  private listen(): void {
    this.volumeService.get$.pipe(takeUntil(this.destroy$)).subscribe(value => (this.gainRadio!.gain.value = value));
    this.playingService.get$.pipe(takeUntil(this.destroy$)).subscribe((isPlaying: boolean) => {
      this.isPlaying = isPlaying;
      this.isPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
    });
  }

  onTooglePlay(): void {
    this.playingService.set$(this.isPlaying ? false : true);
  }

  onClosePopover(): void {
    this.popoverBtn.nativeElement.click();
  }
}
