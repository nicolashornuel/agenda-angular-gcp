import { Component } from '@angular/core';
import { AudioController, PadParam, Position } from 'app/musique/abstracts/audioController.abstract';

@Component({
  selector: 'app-audio-node-delay',
  templateUrl: './audio-node-delay.component.html',
  styleUrls: ['./audio-node-delay.component.scss']
})
export class AudioNodeDelayComponent extends AudioController {

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
      this.feedback.gain.value = this.normalizeValueFromX(position.x, 0, 1);
      this.delayNode.delayTime.value = this.normalizeValueFromY(position.y, 0, 1);
    },
    onEventEnd: () => this.disconnectNode()
  };

  override initNode(): void {
    this.delayNode = new DelayNode(this.audioCtx);
    this.feedback = new GainNode(this.audioCtx);
  }

  override connectNode(): void {
    this.delayNode.delayTime.cancelScheduledValues(this.audioCtx.currentTime);
    this.audioNode.connect(this.delayNode);
    this.delayNode.connect(this.feedback);
    this.feedback.connect(this.delayNode);
    this.delayNode.connect(this.audioCtx.destination);
  }

  override disconnectNode(): void {
    this.delayNode.disconnect();
    this.feedback.disconnect();
    this.feedback.gain.value = 0;
    this.delayNode.delayTime.value = 1;
  }

  }