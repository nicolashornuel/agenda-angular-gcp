import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PAD_MAX } from 'app/musique/services/canvas.service';


@Component({
  selector: 'app-audio-node-analyser-bars',
  templateUrl: './audio-node-analyser-bars.component.html',
  styleUrls: ['./audio-node-analyser-bars.component.scss']
})
export class AudioNodeAnalyserBarsComponent implements AfterViewInit {

  @Input('context') audioCtx!: AudioContext;
  @Input('source') gain!: GainNode;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private canvasCtx!: CanvasRenderingContext2D;
  private analyser!: AnalyserNode;
  private fillStyle!: string;
  private strokeStyle!: string;

  ngAfterViewInit(): void {
    this.initNode();
    this.initCanvas();
  }

  private initNode(): void {
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.minDecibels = -90;            // [-100db-0db]
    this.analyser.maxDecibels = -10;            // [-100db-0db]
    this.analyser.smoothingTimeConstant = 0.85; // [0-1]
    this.analyser.fftSize = 128;                // [32-32768]
    this.gain.connect(this.analyser);
  }

  private initCanvas(): void {
    this.canvas.nativeElement.width = PAD_MAX;
    this.canvas.nativeElement.height = PAD_MAX;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d')!;
    const css: CSSStyleDeclaration = getComputedStyle(this.canvas.nativeElement);
    this.strokeStyle = css.getPropertyValue('color');
    this.fillStyle = css.getPropertyValue('background-color');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.draw(bufferLength, dataArray);
  }

  private draw(bufferLength: number, dataArray: Uint8Array) {
    requestAnimationFrame(() => this.draw(bufferLength, dataArray));
    const { width, height } = this.canvas.nativeElement;
    this.analyser.getByteFrequencyData(dataArray);
    this.canvasCtx.fillStyle = this.fillStyle;
    this.canvasCtx.fillRect(0, 0, width, height);
    const barWidth = (width/ bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i];
      this.canvasCtx.fillStyle = this.strokeStyle;
      this.canvasCtx.fillRect(
        x,
        height - barHeight,
        barWidth,
        barHeight
      );
      x += barWidth + 1;
    }
  };

}