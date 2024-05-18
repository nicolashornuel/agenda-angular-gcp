import { Directive } from '@angular/core';
import { AudioNodeAnalyser } from '../abstracts/audioDirective.abstract';

@Directive({
  selector: '[audioAnalyserWave]'
})
export class AudioAnalyserWaveDirective extends AudioNodeAnalyser {

  protected override draw(bufferLength: number, dataArray: Uint8Array): void {
    this.canvasCtx.fillStyle = this.fillStyle;
    this.canvasCtx.strokeStyle = this.strokeStyle;
    this.canvasCtx.lineWidth = 2;
    requestAnimationFrame(() => this.draw(bufferLength, dataArray));
    const {width, height} = this.canvas.nativeElement;
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