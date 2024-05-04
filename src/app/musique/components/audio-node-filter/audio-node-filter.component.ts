import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { PAD_MAX, PadControlable, PadParam, Position } from 'app/musique/services/canvas.service';


@Component({
  selector: 'app-audio-node-filter',
  templateUrl: './audio-node-filter.component.html',
  styleUrls: ['./audio-node-filter.component.scss']
})
export class AudioNodeFilterComponent implements AfterViewInit, PadControlable, OnDestroy {

  @Input('context') audioCtx!: AudioContext;
  @Input('source') audioNode!: GainNode;
  @Input() type!: BiquadFilterType;

  padParam: PadParam = {
    libelleX: "frequency",
    libelleY: "Q factor",
    isPersist: false,
    onEventStart: () => {
      this.filterNode.type = this.type;
      this.connectNode();
    },
    onEventMove: (position: Position) => {
      const frequency = position.x / PAD_MAX * this.FREQUENCY_MAX;
      const q = this.Q_MAX * (PAD_MAX - (2 * position.y)) / PAD_MAX;;
      this.filterNode.frequency.value = frequency;
      this.filterNode.Q.value = q;
    },
    onEventEnd: () => this.disconnectNode()
  }
  
  private filterNode!: BiquadFilterNode;
  private readonly Q_MAX = 100; // FLOAT32_MAX = 3.4028234663852886e+38;
  private readonly Q_DEFAULT = 1;
  private readonly FREQUENCY_MAX = 8000; // 24000
  private readonly FREQUENCY_DEFAULT = 350;

  constructor() { }

  ngAfterViewInit(): void {
    this.initNode();
  }

  initNode(): void {
    this.filterNode = this.audioCtx.createBiquadFilter();
  }

  connectNode() {
    this.audioNode.connect(this.filterNode).connect(this.audioNode.context.destination);
  }

  disconnectNode(): void {
    this.filterNode.disconnect(0);
    this.resetParam();
  }

  resetParam(): void {
    this.filterNode.frequency.value = this.FREQUENCY_DEFAULT;
    this.filterNode.Q.value = this.Q_DEFAULT;
  }
 
  onPersistChange(event: any): void {
    if (!event.checked) {
      this.disconnectNode();
    } else {
      this.connectNode();
    }
  }

  ngOnDestroy(): void {
    this.disconnectNode()
  }
  
}