import { Component, OnInit } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { AudioGainService } from 'app/musique/services/audio.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-audio-handler',
  templateUrl: './audio-handler.component.html',
  styleUrls: ['./audio-handler.component.scss']
})
export class AudioHandlerComponent implements OnInit {
  public audioCtx!: AudioContext;
  public gainNode!: GainNode;

/*   public effectList = new Set(['highpass', 'lowpass', 'Reverb', 'Delay']);
  public effectSelected = 'highpass'; */
  public effectList: string[] = ['highpass', 'lowpass', 'Reverb', 'Delay'];
  public effectSelected: string = this.effectList[0];

  constructor(
    private gainService: AudioGainService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainService.get$.pipe(takeUntil(this.destroy$))
      .subscribe(value => (this.gainNode.gain.value = value));
  }

  onSelectRadio(effectSelected: string) {
    this.effectSelected = effectSelected; 
  }

}