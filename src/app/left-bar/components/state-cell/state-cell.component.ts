import { Component, inject, Input } from '@angular/core';
import {
  CurrentVideoService,
  PlayerStateService
} from 'app/left-bar/services/left-bar.observable.service';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';

@Component({
  selector: 'app-state-cell',
  templateUrl: './state-cell.component.html',
  styleUrls: ['./state-cell.component.scss']
})
export class StateCellComponent {
  @Input() row!: VideoGAPI;
  public currentVideoService = inject(CurrentVideoService);
  public playerStateService = inject(PlayerStateService);

  onPlay() {
    this.currentVideoService.set$(this.row);
  }
}
