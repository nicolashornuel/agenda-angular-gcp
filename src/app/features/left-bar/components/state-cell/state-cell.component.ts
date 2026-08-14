import { Component, inject, Input } from '@angular/core';
import { YoutubePlayerService } from '@core/services/youtube-player.service';
import { VideoGAPI } from '@features/musique/models/musique.interface';
import {
  CurrentVideoService
} from 'app/features/left-bar/services/left-bar.observable.service';

@Component({
  selector: 'app-state-cell',
  templateUrl: './state-cell.component.html',
  styleUrls: ['./state-cell.component.scss']
})
export class StateCellComponent {
  @Input() row!: VideoGAPI;
  public currentVideoService = inject(CurrentVideoService);
  public youtubePlayerService = inject(YoutubePlayerService );

  onPlay() {
    this.currentVideoService.set$(this.row);
  }
}
