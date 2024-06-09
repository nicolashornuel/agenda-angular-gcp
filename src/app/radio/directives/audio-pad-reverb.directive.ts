import { Directive } from '@angular/core';
import { AudioNodePad, PAD_MAX, PadParam, Position } from '../abstracts/audioDirective.abstract';

@Directive({
  selector: '[audioPadReverb]'
})
export class AudioPadReverbDirective extends AudioNodePad {

  private convolver!: ConvolverNode;
  private gainConvolver!: GainNode;
  private gainValueBkp!: number;
  private isStarting = false;
  
  override padParam: PadParam = {
    libelleX: "buffer",
    libelleY: "gain",
    isPersist: false,
    subValue$: this.volumeService.get$,
    currentPosition: { x: 0, y: PAD_MAX },
    updatePosition: ({ x }, value: number) => ({ x, y: PAD_MAX - (Math.floor(value * 100) / 100) * PAD_MAX }),
    onEventStart: () => {
      this.isStarting = true;
      this.gainValueBkp = this.sourceNode.gain.value;
      this.connectNode();
    },
    onEventMove: (position: Position) => {
      if (!this.padParam.isPersist) this.connectNode();
      this.gainConvolver.gain.value = position.x / 20;
      this.sourceNode.gain.value = this.normalizeValueFromY(position.y, 0, 1);
    },
    onEventEnd: () => { if (!this.padParam.isPersist) this.disconnectNode() }
  }

  override initNode(): void {
    this.convolver = new ConvolverNode(this.audioCtx);
    this.gainConvolver = new GainNode(this.audioCtx);
    this.convolver.buffer = this.getBufferFromCtx();
    this.convolver.normalize = true;
  }

  override connectNode(): void {
    this.sourceNode.connect(this.convolver).connect(this.gainConvolver).connect(this.audioCtx.destination);
  }

  override disconnectNode(): void {
    if (this.convolver) {
      this.convolver.disconnect(0);
      this.gainConvolver.disconnect(0);
      if (this.gainValueBkp && this.isStarting) {
        this.gainConvolver.gain.value = 0;
        this.sourceNode.gain.value = this.gainValueBkp;
        this.isStarting = false;
      }
    }
  }
  
  private getBufferFromCtx(): AudioBuffer {
    // Create an empty three-second stereo buffer at the sample rate of the AudioContext
    const myArrayBuffer = this.audioCtx.createBuffer(2, this.audioCtx.sampleRate * 2, this.audioCtx.sampleRate);
    // Fill the buffer with white noise;
    // just random values between -1.0 and 1.0
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
      // This gives us the actual array that contains the data
      const nowBuffering = myArrayBuffer.getChannelData(channel);
      for (let i = 0; i < myArrayBuffer.length; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        nowBuffering[i] = Math.random() * 2 - 1;
      }
    }
    return myArrayBuffer;
  }
}