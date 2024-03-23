import { AfterViewInit, Component, Input } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { AbstractBpmComponent } from '../../abstracts/abstract-bpm.component';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';

@Component({
  selector: 'app-node-sample',
  templateUrl: './node-sample.component.html',
  styleUrls: ['./node-sample.component.scss']
})
export class NodeSampleComponent extends AbstractBpmComponent implements AfterViewInit, AudioNodeElement {
  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: GainNode;
  
  public nameFile?: string;
  private bufferSource!: AudioBufferSourceNode;
  private compressor!: DynamicsCompressorNode;
  private enveloppe!: GainNode;
  public sampleGain!: GainNode;
  private backup!: AudioBuffer;
  private biquad!: BiquadFilterNode;
  
  param = {
    file: 'assets/sample/BL_Kick14.wav',
    opened: true,
    muted: false,
    gain: 1,
    sequence: [0, 4, 8, 12],
    eg: false,
    amp: 4,
    envParam: {
      attack: 0.1,
      release: 0.3,
      sustain: 0.9
    },
    compressor: -24, // threshold: [0 -100] -24 par défaut
    playbackRate: 1, // (pitch) [0 10]
    modulation: {
      selected: 'none',
      speed: 1, // [1-1000] ms
      depth: 0 // [0-30]
    },
    filter: {
      frequency: 440, // 32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
      q: 1.4
    }
  };
  
  ngAfterViewInit(): void {
    this.initNode();
  }
  
  handleFileInput(event: any): void {
    if (event.target.value) {
      const file: File = event.target.files[0];
      this.nameFile = file.name;
      const reader = new FileReader();
      reader.onload = evt => this.audioCtx.decodeAudioData(evt.target!.result as ArrayBuffer, (buffer: AudioBuffer) => this.loop(buffer));
      reader.readAsArrayBuffer(file);
    }
  }

  initNode(): void {
    this.sampleGain = new GainNode(this.audioCtx, { gain: this.param.gain });
    this.compressor = new DynamicsCompressorNode(this.audioCtx);
    this.biquad = new BiquadFilterNode(this.audioCtx, { type: 'peaking' });
    if (this.param.file) this.loadSample();
  }

  connectNode(): void {
    this.bufferSource = new AudioBufferSourceNode(this.audioCtx);
    this.enveloppe = new GainNode(this.audioCtx);
    this.bufferSource
      .connect(this.compressor)
      .connect(this.enveloppe)
      .connect(this.sampleGain)
      .connect(this.biquad)
      .connect(this.audioNode);
  }

  private async loadSample(): Promise<void> {
    this.nameFile = this.param.file;
    const response = await fetch(this.param.file);
    const buffer = await response.arrayBuffer();
    const sample = await this.audioCtx.decodeAudioData(buffer);
    this.loop(sample);
  }

  private loop(buffer: AudioBuffer): void {
    this.backup = buffer;
    this.getModulation$.subscribe(counter => this.applyModulation(this.param.modulation.selected, counter));
    this.getCurrent$
      .pipe(
        filter(() => !this.param.muted),
        map(current => this.param.sequence.findIndex(number => number === current)),
        filter(index => index != -1)
      )
      .subscribe(() => this.playNote());
  }

  private playNote(): void {
    // BUFFER
    this.connectNode();
    this.bufferSource.start();
    this.bufferSource.buffer = this.backup;
    this.bufferSource.playbackRate.value = this.param.playbackRate;    
    // COMPRESSOR
    this.compressor.threshold.value = this.param.compressor;
    // FILTER
    this.biquad.frequency.value = this.param.filter.frequency;
    this.biquad.Q.value = this.param.filter.q;
    // ENVELOPPE
    const time = this.audioCtx.currentTime;
    if (this.param.eg) {
      this.enveloppe.gain.setValueAtTime(0, time);
      this.enveloppe.gain.linearRampToValueAtTime(1, time + this.param.envParam.attack);
      this.enveloppe.gain.linearRampToValueAtTime(
        this.param.envParam.sustain,
        time + this.duration - this.param.envParam.release
      );
      this.enveloppe.gain.linearRampToValueAtTime(0, time + this.duration);
      //this.bufferSource.stop(time + this.duration);
    } else {
      this.enveloppe.gain.linearRampToValueAtTime(1, time);
      this.enveloppe.gain.linearRampToValueAtTime(0, time + this.param.amp * this.duration);
      //this.bufferSource.stop(time + this.param.amp * this.duration);
    }
  }

  private applyModulation(type: string, counter: number): void {
    switch (type) {
      case 'none':
        if (!this.param.muted && this.bufferSource) {
          this.biquad.gain.value = 30;
        } else {
          this.biquad.gain.value = 0;
        }
        break;
      case 'filter':
        this.biquad.gain.linearRampToValueAtTime(counter % 2 === 0 ? (30 - this.param.modulation.depth) : 30, this.audioCtx.currentTime);
        break;
      default:
        break;
    }
  }
}
