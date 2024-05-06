import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {DestroyService} from '@shared/services/destroy.service';
import { AudioGainService } from 'app/musique/services/audio.service';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-audio-node-radio',
  templateUrl: './audio-node-radio.component.html',
  styleUrls: ['./audio-node-radio.component.scss']
})
export class AudioNodeRadioComponent implements AfterViewInit {
  @Input('context') audioCtx!: AudioContext;
  @Input('source') gainNode!: GainNode;
  @ViewChild('audio') audio!: ElementRef;
  @ViewChild('popover') popoverBtn!: ElementRef;
  private source!: MediaElementAudioSourceNode;
  public gainRadio!: GainNode;
  public isPlaying: boolean = false;
  public radioList = [
    {
      id: 'FIP',
      url: 'https://icecast.radiofrance.fr/fip-midfi.mp3?id=openapi'
    },
    {
      id: 'Bassdrive',
      url: 'http://chi.bassdrive.co/;stream/1'
    }
  ];

  public radioSelected = this.radioList[0];

  constructor(private gainService: AudioGainService, private destroy$: DestroyService) {}

  ngAfterViewInit(): void {
    this.source = this.audioCtx.createMediaElementSource(this.audio.nativeElement);
    this.gainRadio = new GainNode(this.audioCtx);
    this.gainService.get$.pipe(takeUntil(this.destroy$)).subscribe(value => {this.gainRadio.gain.value = value});
    this.source.connect(this.gainNode).connect(this.audioCtx.destination);
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
