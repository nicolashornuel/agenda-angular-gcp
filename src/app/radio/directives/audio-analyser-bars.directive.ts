import { Directive } from '@angular/core';
import { AudioNodeAnalyser } from '../abstracts/audioDirective.abstract';

@Directive({
  selector: '[audioAnalyserBars]'
})
export class AudioAnalyserBarsDirective extends AudioNodeAnalyser {

  protected override draw(bufferLength: number, dataArray: Uint8Array) {
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