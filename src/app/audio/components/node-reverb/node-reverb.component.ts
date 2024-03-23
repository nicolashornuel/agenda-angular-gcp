import { AfterViewInit, Component, Input } from '@angular/core';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { PAD_MAX, PadControlable, PadParam, Position } from '../../interfaces/padControlCanvas.interface';
import { MainGainService } from '../../services/mainGain.service';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-node-reverb',
  templateUrl: './node-reverb.component.html',
  styleUrls: ['./node-reverb.component.scss']
})
export class NodeReverbComponent implements AfterViewInit, AudioNodeElement, PadControlable {

  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: GainNode;

  padParam: PadParam = {
    libelleX: "buffer",
    libelleY: "gain",
    isPersist: false,
    subValue$: this.gainService.getMainGainValue$,
    currentPosition: { x: 0, y: PAD_MAX },
    updatePosition: ({ x }, value: number) => ({ x, y: PAD_MAX - (Math.floor(value * 100) / 100) * PAD_MAX }),
    onEventStart: () => {
      this.isStarting = true;
      this.gainValueBkp = this.audioNode.gain.value;
      this.connectNode();
    },
    onEventMove: (position: Position) => {
      if (!this.padParam.isPersist) this.connectNode();
      this.gainConvolver.gain.value = position.x / 20;
      this.audioNode.gain.value = Math.ceil(((PAD_MAX - position.y) / PAD_MAX) * 100) / 100;
    },
    onEventEnd: () => { if (!this.padParam.isPersist) this.disconnectNode() }
  }
  
  private convolver!: ConvolverNode;
  private gainConvolver!: GainNode;
  private gainValueBkp!: number;
  private isStarting = false;

  constructor(private gainService: MainGainService, private canvasService: CanvasService) { }

  ngAfterViewInit(): void {
    this.initNode();
  }

  initNode(): void {
    this.convolver = this.audioCtx.createConvolver();
    this.gainConvolver = this.audioCtx.createGain();
    this.convolver.buffer = this.getBufferFromCtx();
    this.convolver.normalize = true;
  }

  connectNode(): void {
    this.audioNode.connect(this.convolver);
    this.convolver.connect(this.gainConvolver);
    this.gainConvolver.connect(this.audioCtx.destination);
  }

  disconnectNode(): void {
    this.canvasService.clearCanvas(this.padParam.canvas!);
    this.convolver.disconnect(0);
    this.gainConvolver.disconnect(0);
    this.resetParam();
  }

  resetParam(): void {
    if (this.gainValueBkp && this.isStarting) {
      this.gainConvolver.gain.value = 0;
      this.audioNode.gain.value = this.gainValueBkp;
      this.isStarting = false;
    }
  }

  onPersistChange(event: any): void {
    if (!event.checked) {
      this.disconnectNode();
    } else {
      this.connectNode();
    }
  }

  getBufferFromCtx(): AudioBuffer {
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
