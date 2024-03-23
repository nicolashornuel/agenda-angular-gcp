import { AfterViewInit, Component, Input } from '@angular/core';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import {
  PadControlable,
  PadParam,
  Position,
  normalizeValueFromX,
  normalizeValueFromY,
  normalizeYFromValue
} from '../../interfaces/padControlCanvas.interface';

@Component({
  selector: 'app-node-delay',
  templateUrl: './node-delay.component.html',
  styleUrls: ['./node-delay.component.scss']
})
export class NodeDelayComponent implements AfterViewInit, AudioNodeElement, PadControlable {
  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: AudioNode;
  private delayNode!: DelayNode;
  private feedback!: GainNode;

  padParam: PadParam = {
    libelleX: 'feedback',
    libelleY: 'delayTime',
    isPersist: false,
    updatePosition: ({ x }, value: number) => ({ x, y: normalizeYFromValue(value, 0, 1) }),
    onEventStart: () => {},
    onEventMove: (position: Position) => {
      this.connectNode();
      this.feedback.gain.value = normalizeValueFromX(position.x, 0, 1);
      this.delayNode.delayTime.value = normalizeValueFromY(position.y, 0, 1);
    },
    onEventEnd: () => this.disconnectNode()
  };

  ngAfterViewInit(): void {
    this.initNode();
  }

  initNode(): void {
    this.delayNode = new DelayNode(this.audioCtx);
    this.feedback = new GainNode(this.audioCtx);
  }

  connectNode(): void {
    this.delayNode.delayTime.cancelScheduledValues(this.audioCtx.currentTime);
    this.audioNode.connect(this.delayNode);
    this.delayNode.connect(this.feedback);
    this.feedback.connect(this.delayNode);
    this.delayNode.connect(this.audioCtx.destination);
  }

  disconnectNode(): void {
    this.delayNode.disconnect();
    this.feedback.disconnect();
    this.resetParam();
  }

  resetParam(): void {
    this.feedback.gain.value = 0;
    this.delayNode.delayTime.value = 1;
  }

  onPersistChange(event: any): void {
    if (!event.checked) this.disconnectNode();
  }
}
