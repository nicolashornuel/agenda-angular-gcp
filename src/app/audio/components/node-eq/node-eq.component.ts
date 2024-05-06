import { AfterViewInit, Component, Input } from '@angular/core';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';

@Component({
  selector: 'app-node-eq',
  templateUrl: './node-eq.component.html',
  styleUrls: ['./node-eq.component.scss']
})
export class NodeEqComponent implements AfterViewInit, AudioNodeElement {

  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: GainNode;
  public eqs: BiquadFilterNode[] = [];
  private freqs = [32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
  }

  initNode(): void {
    this.freqs.forEach(freq => {
      const biquad = this.audioCtx.createBiquadFilter();
      biquad.type = 'peaking';
      biquad.frequency.value = freq;
      biquad.Q.value = 1.4;
      biquad.gain.value = 0;
      this.eqs.push(biquad);
    });
  }

  connectNode() {
    this.audioNode.connect(this.eqs[0]);
    for (let i = 1; i < this.eqs.length; i++) {
      this.eqs[i - 1].connect(this.eqs[i]);
    }
    this.eqs[this.eqs.length - 1].connect(this.audioNode.context.destination);
  }

  disconnectNode(): void {
    for (let i = 0; i < this.eqs.length; i++) {
      this.eqs[i].disconnect();
    }
    this.resetParam();
  }

  resetParam(): void {
    this.eqs.forEach(eq => eq.gain.value = 0);
  }

}
