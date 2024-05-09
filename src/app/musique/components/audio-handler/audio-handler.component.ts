import {Component, OnInit} from '@angular/core';
import {DestroyService} from '@shared/services/destroy.service';
import {AudioVolumeService, EffectPersistService} from 'app/musique/services/audio.service';
import {combineLatest, takeUntil} from 'rxjs';

@Component({
  selector: 'app-audio-handler',
  templateUrl: './audio-handler.component.html',
  styleUrls: ['./audio-handler.component.scss']
})
export class AudioHandlerComponent implements OnInit {
  public audioCtx!: AudioContext;
  public gainNode!: GainNode;
  public effectList: string[] = ['highpass', 'lowpass', 'Reverb', 'Delay'];
  public effectSelected: string = this.effectList[0];
  public isPersist: boolean = false;

  constructor(
    private volumeService: AudioVolumeService,
    private persistService: EffectPersistService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.audioCtx = new AudioContext();
    this.gainNode = new GainNode(this.audioCtx);
    combineLatest([this.volumeService.get$, this.persistService.get$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        this.gainNode.gain.value = values[0];
        this.isPersist = values[1];
      });
  }

  onGainChange(value: number): void {
    this.volumeService.set$(value);
  }

  onSelectEffect(effectSelected: string) {
    this.effectSelected = effectSelected;
    this.onPersistChange(false);
  }

  onPersistChange(event: boolean): void {
    this.isPersist = event;
    this.persistService.set$(this.isPersist);
  }
}
