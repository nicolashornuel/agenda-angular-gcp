import { Component, Input } from '@angular/core';
import { AudioGainService } from 'app/musique/services/audio.service';

@Component({
  selector: 'app-audio-node-gain',
  templateUrl: './audio-node-gain.component.html',
  styleUrls: ['./audio-node-gain.component.scss']
})
export class AudioNodeGainComponent {

  @Input('source') gainNode!: GainNode;

  constructor(private gainService: AudioGainService ) { }

  valueChange(value: number): void {
    this.gainService.set$(value);
  }

}
