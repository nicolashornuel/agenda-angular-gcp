import { Directive } from '@angular/core';
import { AudioNodePad, PadParam, Position } from '../abstracts/audioDirective.abstract';

@Directive({
  selector: '[audioPadDelay]'
})
export class AudioPadDelayDirective extends AudioNodePad {
  private delayNode!: DelayNode;
  private feedback!: GainNode;
  override padParam: PadParam = {
    libelleX: 'feedback',
    libelleY: 'delayTime',
    isPersist: false,
    updatePosition: ({ x }, value: number) => ({ x, y: this.normalizeYFromValue(value, 0, 1) }),
    onEventStart: () => {},
    onEventMove: (position: Position) => {
      this.connectNode();
      this.feedback.gain.value = this.normalizeValueFromX(position.x, 0.1, 1.2);
      this.delayNode.delayTime.value = this.normalizeValueFromY(position.y, 0.1, 1); // [0-1]
    },
    onEventEnd: () => this.disconnectNode()
  };

  protected override initNode(): void {
    this.delayNode = new DelayNode(this.audioCtx);
    this.feedback = new GainNode(this.audioCtx);
  }

  protected override connectNode(): void {
    this.delayNode.delayTime.cancelScheduledValues(this.audioCtx.currentTime);
    this.sourceNode.connect(this.delayNode);
    this.delayNode.connect(this.feedback);
    this.feedback.connect(this.delayNode);
    this.delayNode.connect(this.audioCtx.destination);
  }

  protected override disconnectNode(): void {
    if (this.delayNode) {
      this.delayNode.disconnect();
      this.feedback.disconnect();
      this.feedback.gain.value = 0;
      this.delayNode.delayTime.value = 1;
    }
  }
}
