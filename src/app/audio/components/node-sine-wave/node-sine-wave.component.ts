import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PAD_MAX } from '../../interfaces/padControlCanvas.interface';

@Component({
  selector: 'app-node-sine-wave',
  templateUrl: './node-sine-wave.component.html',
  styleUrls: ['./node-sine-wave.component.scss']
})
export class NodeSineWaveComponent implements AfterViewInit {

  @Input('context') audioCtx!: AudioContext;
  @Input('source') gain!: GainNode;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private canvasCtx!: CanvasRenderingContext2D;
  private analyser!: AnalyserNode;

  ngAfterViewInit(): void {
    this.initNode();
    this.initCanvas();
  }

  private initNode(): void {
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.minDecibels = -90;            // [-100db-0db]
    this.analyser.maxDecibels = -10;            // [-100db-0db]
    this.analyser.smoothingTimeConstant = 0.85; // [0-1]
    this.analyser.fftSize = 512;                // [32-32768]
    this.gain.connect(this.analyser);
  }

  private initCanvas(): void {
    this.canvas.nativeElement.width = PAD_MAX;
    this.canvas.nativeElement.height = PAD_MAX;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d')!;
    const css: CSSStyleDeclaration = getComputedStyle(this.canvas.nativeElement);
    const colorCss = css.getPropertyValue('color');
    const bgColorCss = css.getPropertyValue('background-color');
    this.canvasCtx.fillStyle = bgColorCss;
    this.canvasCtx.strokeStyle = colorCss;
    this.canvasCtx.lineWidth = 2;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.draw(bufferLength, dataArray);
  }

  private draw(bufferLength: number, dataArray: Uint8Array): void {
    requestAnimationFrame(() => this.draw(bufferLength, dataArray));
    const { width, height } = this.canvas.nativeElement;
    this.analyser.getByteTimeDomainData(dataArray);
    this.canvasCtx.fillRect(0, 0, width, height);
    this.canvasCtx.beginPath();
    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * height) / 2;
      if (i === 0) {
        this.canvasCtx.moveTo(x, y);
      } else {
        this.canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.canvasCtx.lineTo(width, height / 2);
    this.canvasCtx.stroke();
  }

}


