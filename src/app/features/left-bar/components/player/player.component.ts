import { Component, OnInit } from '@angular/core';
import { RepeatMode } from 'app/features/left-bar/models/left-bar.model';
import { filter, take } from 'rxjs';
import { PlaylistController } from '../abstracts/playlist-controller.abstract';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent extends PlaylistController implements OnInit {
  public loading: boolean = false;
  private player: any;
  private isFirstLoad = true;

  ngOnInit(): void {
    this.handleYoutubeIframe();
  }

  private handleYoutubeIframe() {
    this.loading = true;
    this.youtubePlayerService.apiReady$.pipe(take(1)).subscribe(() => {
      this.loading = false;
      this.player = this.youtubePlayerService.createPlayer('ytplayer', this.currentVideoService.value?.videoId ?? '', () =>
        this.playNext()
      );
      this.playlist$.pipe(filter(() => !this.currentVideoService.value)).subscribe(() => this.goTo(0));
      this.currentVideo$
        .pipe(filter(currentVideo => !!currentVideo))
        .subscribe(currentVideo => {
          if (this.isFirstLoad) {
            this.isFirstLoad = false;
            this.player.cueVideoById(currentVideo?.videoId);
          } else {
            this.player.loadVideoById(currentVideo?.videoId);
          }
        });
    });

    this.playing$.pipe(filter(() => this.player)).subscribe(isPlaying => isPlaying ? this.player.playVideo() : this.player.pauseVideo());

  }

  private playNext(): void {
    const next = this.nextIndex();
    if (next !== null) this.goTo(next);
  }

  private nextIndex(): number | null {
    if (this.repeatModeService.value === RepeatMode.One) return this.currentIndex;

    if (this.shuffleService.value) return Math.floor(Math.random() * this.playlistService.value.videos.length);

    if (this.isLast) return this.repeatModeService.value === RepeatMode.All ? 0 : null;

    return this.currentIndex + 1;
  }
}
