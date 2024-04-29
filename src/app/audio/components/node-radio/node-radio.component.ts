import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-node-radio',
  templateUrl: './node-radio.component.html',
  styleUrls: ['./node-radio.component.scss']
})
export class NodeRadioComponent implements AfterViewInit {
  @Input('context') audioCtx!: AudioContext;
  @Input('source') gainNode!: GainNode;
  @ViewChild('audio') audio!: ElementRef;
  private source!: MediaElementAudioSourceNode;
  public gainRadio!: GainNode;
  public isPlaying: boolean = false;
  public radioList = [
    {
      id: 'Bassdrive',
      url: 'http://chi.bassdrive.co/;stream/1'
    },
    {
      id: 'Trancetechnique UK',
      url: 'http://51.89.195.240:8034/stream'
    }
  ]

  public radioSelected = this.radioList[0];

  constructor() {}

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
  }

  initNode(): void {
    this.source = this.audioCtx.createMediaElementSource(this.audio.nativeElement);
    this.gainRadio = new GainNode(this.audioCtx, { gain: 0.1 });
  }

  connectNode(): void {
    this.source.connect(this.gainRadio).connect(this.gainNode).connect(this.audioCtx.destination);
  }

  onTooglePlay(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
  }

}
