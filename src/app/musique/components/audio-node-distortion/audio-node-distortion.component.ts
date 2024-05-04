import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-audio-node-distortion',
  templateUrl: './audio-node-distortion.component.html',
  styleUrls: ['./audio-node-distortion.component.scss']
})
export class AudioNodeDistortionComponent implements AfterViewInit {

  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: GainNode;

  currentValue: number = 0;
  private distortion!: WaveShaperNode; //curve OverSampleType = "2x" | "4x" | "none";

  constructor() { }

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
  }

  initNode(): void {
    this.distortion = this.audioCtx.createWaveShaper();
    console.log(this.distortion);
  }

  connectNode() {
    this.audioNode.connect(this.distortion);
    this.distortion.connect(this.audioNode.context.destination);
  }

  disconnectNode(): void {
    this.distortion.disconnect(0);
    this.resetParam();
  }

  resetParam(): void {
    this.distortion.curve = null;
  }

  onChange(value: number): void {
      this.distortion.curve = this.makeDistortionCurve(value);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createWaveShaper#examples
  makeDistortionCurve(k: number) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; i++) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

}
