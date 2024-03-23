import { AfterViewInit, Component, Input } from '@angular/core';
import { AbstractBpmComponent } from '../../abstracts/abstract-bpm.component';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { gamme } from '../../models/gamme.constant';
import { OscParam } from '../../models/oscillator.interface';

@Component({
  selector: 'app-node-oscillator',
  templateUrl: './node-oscillator.component.html',
  styleUrls: ['./node-oscillator.component.scss']
})
export class NodeOscillatorComponent extends AbstractBpmComponent implements AfterViewInit, AudioNodeElement {
  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: GainNode;
  oscillatorGain!: GainNode;
  biquad!: BiquadFilterNode;
  compressor!: DynamicsCompressorNode;
  oscillator!: OscillatorNode;
  private enveloppe!: GainNode;
  oscillatorTypes: OscillatorType[] | string[] = ['sine', 'square', 'sawtooth', 'triangle'];
  octaves: number[] = [...Array(9).keys()];

  param: OscParam = {
    opened: true,
    muted: false,
    gain: 5,
    detune: 0,
    type: 'sine',
    octave: 3,
    sequence: {
      0: ['do']
    },
    eg: false,
    amp: 16,
    envParam: {
      attack: 0.1,
      release: 0.3,
      sustain: 0.9
    },
    modulation: {
      selected: 'none',
      speed: 1, // [1-1000] ms
      depth: 0 // [0-30]
    },
    compressor: -24,    // threshold: [0 -100] -24 par défaut
    filter: {
      frequency: 440, // 32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
      Q: 1.4
    }
  };

  ngAfterViewInit(): void {
    this.initNode();
  }

  initNode(): void {
    this.oscillatorGain = new GainNode(this.audioCtx, { gain: this.param.gain });
    this.biquad = new BiquadFilterNode(this.audioCtx, { ...this.param.filter, type: 'peaking', gain: 0});
    this.compressor = new DynamicsCompressorNode(this.audioCtx, { threshold: this.param.compressor });
    this.oscillator = new OscillatorNode(this.audioCtx);
    this.enveloppe = new GainNode(this.audioCtx);
    this.getModulation$.subscribe(counter => this.applyModulation(this.param.modulation.selected, counter));
    this.getCurrent$.subscribe(() => {
      if (this.param.sequence[this.current] != undefined && !this.param.muted)
        this.param.sequence[this.current].forEach((note: string) => this.playNote(note));
    });
  }

  connectNode() {
    this.oscillator = new OscillatorNode(this.audioCtx);
    this.enveloppe = new GainNode(this.audioCtx);
    this.oscillator.connect(this.compressor).connect(this.enveloppe).connect(this.oscillatorGain).connect(this.biquad).connect(this.audioNode);
  }

  private playNote(note: string): void {
    const time = this.audioCtx.currentTime;
    this.connectNode();
    this.oscillator.start();
    this.oscillator.type = this.param.type as OscillatorType;
    this.oscillator.detune.value = this.param.detune;
    this.oscillator.frequency.value = gamme[note].frequencies[this.param.octave];
    // AMP EG - ENVELOPPE
    if (this.param.eg) {
      this.enveloppe.gain.setValueAtTime(0, time);
      this.enveloppe.gain.linearRampToValueAtTime(1, time + this.param.envParam.attack);
      this.enveloppe.gain.linearRampToValueAtTime(
        this.param.envParam.sustain,
        time + this.duration - this.param.envParam.release
      );
      this.enveloppe.gain.exponentialRampToValueAtTime(0.01, time + this.duration);
      this.oscillator.stop(time + this.duration);
    } else {
      this.enveloppe.gain.linearRampToValueAtTime(1, time);
      this.enveloppe.gain.exponentialRampToValueAtTime(0.01, time + this.param.amp * this.duration);
      this.oscillator.stop(time + this.param.amp * this.duration);
    }
  }

  private applyModulation(type: string, counter: number): void {
    switch (type) {
      case 'none':
        //this.biquad.gain.linearRampToValueAtTime(this.param.muted ? 0 : 30, this.audioCtx.currentTime);
        break;
      case 'filter':
        this.biquad.gain.linearRampToValueAtTime(counter % 2 === 0 ? (30 - this.param.modulation.depth) : 30, this.audioCtx.currentTime);
      break;
      default:
        break;
    }
  }

}
