import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {DestroyService} from '@shared/services/destroy.service';
import { AudioNodeController } from 'app/musique/abstracts/audioDirective.abstract';
import { AudioVolumeService } from 'app/musique/services/audio.service';
import {takeUntil} from 'rxjs';

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

  constructor(private volumeService: AudioVolumeService, private destroy$: DestroyService) {
    super();
  }

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
  }

  protected override initNode(): void {
    this.source = new MediaElementAudioSourceNode(this.audioCtx, {mediaElement: this.audio.nativeElement});
    this.gainRadio = new GainNode(this.audioCtx);
    
  }

  protected override connectNode(): void {
    this.volumeService.get$.pipe(takeUntil(this.destroy$)).subscribe(value => this.gainRadio!.gain.value = value);
    this.source.connect(this.sourceNode).connect(this.audioCtx.destination);
  }

  onTooglePlay(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
  }

  onSelectedChange(event: any): void {
    console.log(event);
  }

  onClosePopover(): void {
    this.popoverBtn.nativeElement.click();
  }
}
