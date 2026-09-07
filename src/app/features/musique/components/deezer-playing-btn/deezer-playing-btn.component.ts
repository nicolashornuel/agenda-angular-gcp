import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { RadioPlayingService } from '@features/radio/services/audio.observable.service';
import { DestroyService } from '@shared/services/destroy.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-deezer-playing-btn',
  templateUrl: './deezer-playing-btn.component.html',
  styleUrls: ['./deezer-playing-btn.component.scss']
})
export class DeezerPlayingBtnComponent implements OnInit {
  @Input() src?: string;
  @ViewChild('audio') audio!: ElementRef;
  public isPlaying: boolean = false;
  private playingService = inject(RadioPlayingService);
  private destroy$ = inject(DestroyService);

  ngOnInit(): void {
    this.playingService.get$.pipe(takeUntil(this.destroy$)).subscribe(playing => {
      if (this.isPlaying) this.setRadioPlaying(playing);
    });
  }

  private setRadioPlaying(play: boolean): void {
    this.isPlaying = play;
    this.isPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
  }

  onTooglePlay(): void {
    this.setRadioPlaying(!this.isPlaying);
    this.playingService.set$(this.isPlaying);
  }
}
