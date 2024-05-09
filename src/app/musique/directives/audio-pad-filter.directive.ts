import { Directive, Input } from '@angular/core';
import { AudioNodePad, PAD_MAX, PadParam, Position } from './audioDirective.abstract';

@Directive({
  selector: '[audioPadFilter]'
})
export class AudioPadFilterDirective extends AudioNodePad {
  @Input() type!: BiquadFilterType;
  private filterNode!: BiquadFilterNode;
  private readonly Q_MAX = 100; // FLOAT32_MAX = 3.4028234663852886e+38;
  private readonly Q_DEFAULT = 1;
  private readonly FREQUENCY_MAX = 8000; // 24000
  private readonly FREQUENCY_DEFAULT = 350;

  override padParam: PadParam = {
    libelleX: 'frequency',
    libelleY: 'Q factor',
    isPersist: false,
    onEventStart: () => {
      this.filterNode.type = this.type;
      this.connectNode();
    },
    onEventMove: (position: Position) => {
      const frequency = (position.x / PAD_MAX) * this.FREQUENCY_MAX;
      const q = (this.Q_MAX * (PAD_MAX - 2 * position.y)) / PAD_MAX;
      this.filterNode.frequency.value = frequency;
      this.filterNode.Q.value = q;
    },
    onEventEnd: () => this.disconnectNode()
  };


  override initNode(): void {
    this.filterNode = this.audioCtx.createBiquadFilter();
  }

  override connectNode(): void {
    this.sourceNode.connect(this.filterNode).connect(this.sourceNode.context.destination);
  }

  override disconnectNode(): void {
    if (this.filterNode) {
      this.filterNode.disconnect(0);
      this.filterNode.frequency.value = this.FREQUENCY_DEFAULT;
      this.filterNode.Q.value = this.Q_DEFAULT;
    }
  }
}
