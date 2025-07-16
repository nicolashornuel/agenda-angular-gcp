import { Directive, Input } from '@angular/core';
import { AudioNodeAnalyser } from '../abstracts/audioDirective.abstract';

@Directive({
  selector: '[audioAnalyserWave]'
})
export class AudioAnalyserWaveDirective extends AudioNodeAnalyser {
  @Input() sensitivity: number = 10; // Nouveau paramètre d'entrée

  protected draw(bufferLength: number, dataArray: Uint8Array): void {
    this.canvasCtx.fillStyle = this.fillStyle;
    this.canvasCtx.strokeStyle = this.strokeStyle;
    this.canvasCtx.lineWidth = 2;
    requestAnimationFrame(() => this.draw(bufferLength, dataArray));
    const { width, height } = this.canvas.nativeElement;

    // Analyser le niveau sonore global
    this.analyser.getByteTimeDomainData(dataArray);

    // Calculer le RMS (Root Mean Square) pour mesurer l'amplitude
    let rms = 0;
    for (let i = 0; i < bufferLength; i++) {
      const sample = (dataArray[i] - 128) / 128.0;
      rms += sample * sample;
    }
    rms = Math.sqrt(rms / bufferLength);

    // Ajuster la sensibilité basée sur le RMS
    const dynamicSensitivity = this.sensitivity * (1 + rms * 2);
    this.canvasCtx.fillRect(0, 0, width, height);
    this.canvasCtx.beginPath();

    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = ((dataArray[i] - 128) / 128.0) * dynamicSensitivity;
      v = Math.max(-1, Math.min(1, v)); // Limiter entre -1 et 1

      let y = height / 2 + (v * height) / 2;

      if (i === 0) {
        this.canvasCtx.moveTo(x, y);
      } else {
        this.canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    this.canvasCtx.stroke();
  }
}
