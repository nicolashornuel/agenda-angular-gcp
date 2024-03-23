import { Component, Input } from '@angular/core';
import { MainGainService } from '../../services/mainGain.service';

@Component({
  selector: 'app-node-gain',
  templateUrl: './node-gain.component.html',
  styleUrls: ['./node-gain.component.scss']
})
export class NodeGainComponent {

  @Input('source') gainNode!: GainNode;

  constructor(private gainService: MainGainService ) { }

  mainGainValueChange(value: number): void {
    this.gainService.setMainGainValue$(value);
  }

}
