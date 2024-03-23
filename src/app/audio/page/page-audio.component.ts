import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { NodeSampleComponent } from '../components/node-sample/node-sample.component';
import { MainGainService } from '../services/mainGain.service';

@Component({
  selector: 'app-page-audio',
  templateUrl: './page-audio.component.html',
  styleUrls: ['./page-audio.component.scss']
})
export class PageAudioComponent implements OnInit, OnDestroy {
  public audioCtx!: AudioContext;
  public gainNode!: GainNode;
  @ViewChild('insertNodeSample', {read: ViewContainerRef}) target!: ViewContainerRef;
  public effectList: string[] = ['highpass', 'lowpass', 'Reverb', 'Delay'];
  public effectSelected: string = this.effectList[0];

  constructor(
    private gainService: MainGainService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainService.getMainGainValue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(mainGainValue => (this.gainNode.gain.value = mainGainValue));
  }

  mainGainValueChange(value: number): void {
    this.gainService.setMainGainValue$(value);
  }

  addNodeSample(): void {
    const viewRef: ComponentRef<NodeSampleComponent> = this.target.createComponent(NodeSampleComponent);
    viewRef.instance.audioCtx = this.audioCtx;
    viewRef.instance.audioNode = this.gainNode;
  }

  ngOnDestroy(): void {
      this.target.remove();
  }

}
