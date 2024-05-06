import {Component, Input} from '@angular/core';
import {AudioController, PAD_MAX, PadParam, Position} from 'app/musique/abstracts/audioController.abstract';

@Component({
  selector: 'app-audio-node-filter',
  templateUrl: './audio-node-filter.component.html',
  styleUrls: ['./audio-node-filter.component.scss']
})
export class AudioNodeFilterComponent extends AudioController {
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

  override connectNode() {
    this.audioNode.connect(this.filterNode).connect(this.audioNode.context.destination);
  }

  override disconnectNode(): void {
    this.filterNode.disconnect(0);
    this.filterNode.frequency.value = this.FREQUENCY_DEFAULT;
    this.filterNode.Q.value = this.Q_DEFAULT;
  }
}
