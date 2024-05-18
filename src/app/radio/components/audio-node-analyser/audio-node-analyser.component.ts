import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audio-node-analyser',
  templateUrl: './audio-node-analyser.component.html',
  styleUrls: ['./audio-node-analyser.component.scss']
})
export class AudioNodeAnalyserComponent {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
}
