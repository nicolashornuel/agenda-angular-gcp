import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-audio-control-equ',
  templateUrl: './audio-control-equ.component.html',
  styleUrls: ['./audio-control-equ.component.scss']
})
export class AudioControlEquComponent implements AfterViewInit {

  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: GainNode;
  public eqs: BiquadFilterNode[] = [];
  private freqs = [32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  public equList: any;
  public equSelected: any;

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

  public onReset(): void {
    this.eqs.forEach(eq => eq.gain.value = 0);
  }
  public onSave(): void {
    console.log(this.equSelected);
  }

  public onSelect(equSelected: any): void {
    this.equSelected = equSelected;
  }

}
