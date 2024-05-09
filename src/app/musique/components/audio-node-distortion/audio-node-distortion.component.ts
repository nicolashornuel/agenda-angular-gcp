import { AfterViewInit, Component } from '@angular/core';
import { AudioNodeController } from 'app/musique/directives/audioDirective.abstract';

@Component({
  selector: 'app-audio-node-distortion',
  templateUrl: './audio-node-distortion.component.html',
  styleUrls: ['./audio-node-distortion.component.scss']
})
export class AudioNodeDistortionComponent extends AudioNodeController implements AfterViewInit {

  public currentValue: number = 0;
  private distortion!: WaveShaperNode; //curve OverSampleType = "2x" | "4x" | "none";

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
  }

  protected override initNode(): void {
    this.distortion = new WaveShaperNode(this.audioCtx, {curve: [0]});
  }
  protected override connectNode(): void {
    this.sourceNode.connect(this.distortion).connect(this.sourceNode.context.destination);
  }

  onPotChange(value: number): void {
      this.distortion.curve = this.generateDistortion(value);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createWaveShaper#examples
  private generateDistortion(k: number) {
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
