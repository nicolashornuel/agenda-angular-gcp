import { inject } from '@angular/core';
import { DestroyService } from '@shared/services/destroy.service';
import { PlaylistSummary, RepeatMode } from 'app/left-bar/models/left-bar.model';
import {
  CurrentVideoService,
  PlayerStateService,
  PlaylistService,
  PlaylistSummaryService,
  RepeatModeService,
  SuffleService
} from 'app/left-bar/services/left-bar.observable.service';
import { VideoGAPI } from 'app/musique/models/videoGAPI.interface';
import { YoutubeService } from 'app/musique/services/youtube.service';
import { takeUntil } from 'rxjs';

export abstract class PlaylistController {
  protected destroy$ = inject(DestroyService);

  protected playlistSummaryService = inject(PlaylistSummaryService);
  protected playlistService = inject(PlaylistService);
  protected currentVideoService = inject(CurrentVideoService);
  protected playerStateService = inject(PlayerStateService);
  protected repeatModeService = inject(RepeatModeService);
  protected shuffleService = inject(SuffleService);
  protected youtubeService = inject(YoutubeService);

  protected readonly playlistSummary$ = this.playlistSummaryService.get$.pipe(takeUntil(this.destroy$));
  protected readonly playlist$ = this.playlistService.get$.pipe(takeUntil(this.destroy$));
  protected readonly currentVideo$ = this.currentVideoService.get$.pipe(takeUntil(this.destroy$));
  protected readonly playerState$ = this.playerStateService.get$.pipe(takeUntil(this.destroy$));
  protected readonly repeatMode$ = this.repeatModeService.get$.pipe(takeUntil(this.destroy$));
  protected readonly shuffle$ = this.shuffleService.get$.pipe(takeUntil(this.destroy$));

  public readonly RepeatMode = RepeatMode;

  protected loadPlaylist(playlistSummary?: PlaylistSummary): void {
    if (!playlistSummary?.id) {
      this.playlistService.clear();
      return;
    }

    this.playlistService.load(playlistSummary.id).subscribe();
  }

  protected async createPlaylist(name: string): Promise<PlaylistSummary> {
    const summary = await this.playlistSummaryService.add(name);

    await this.playlistService.createPlaylist(summary.id!);

    return summary;
  }

  protected onDrop(video: VideoGAPI): void {
    this.playlistService.add(video);
  }

  protected onMove() {
    this.playlistService.move();
  }

  protected async onRemovePlaylistSummary(id: string): Promise<void> {
    await this.playlistSummaryService.remove(id);
    await this.playlistService.removePlaylist(id);
  }

  protected async removePlaylist(id: string): Promise<void> {
    await this.playlistSummaryService.remove(id);
    await this.playlistService.removePlaylist(id);
    this.playlistService.clear();
  }

  protected onShuffle(): void {
    this.shuffleService.set$(!this.shuffleService.value);
  }

  protected onRepeat(): void {
    switch (this.repeatModeService.value) {
      case RepeatMode.None:
        this.repeatModeService.set$(RepeatMode.All);
        break;

      case RepeatMode.All:
        this.repeatModeService.set$(RepeatMode.One);
        break;

      case RepeatMode.One:
        this.repeatModeService.set$(RepeatMode.None);
        break;
    }
  }

  protected onPrev(): void {
    if (!this.isFirst) {
      this.goTo(this.currentIndex - 1);
    }
  }

  protected onNext(): void {
    if (!this.isLast) {
      this.goTo(this.currentIndex + 1);
    }
  }

  protected get repeatIcon(): string {
    return this.repeatModeService.value === RepeatMode.One ? 'fa-rotate-right' : 'fa-repeat';
  }

  protected get repeatActive(): boolean {
    return this.repeatModeService.value !== RepeatMode.None;
  }

  protected get currentIndex(): number {
    return this.playlistService.value.videos.findIndex(
      video => video.videoId === this.currentVideoService.value?.videoId
    );
  }

  protected goTo(index: number): void {
    const videos = this.playlistService.value.videos;

    if (index < 0 || index >= videos.length) {
      return;
    }

    this.currentVideoService.set$(videos[index]);
  }

  protected get isFirst(): boolean {
    return this.currentIndex <= 0;
  }

  protected get isLast(): boolean {
    return this.currentIndex >= this.playlistService.value.videos.length - 1;
  }

  protected get currentPlaylist() {
    return this.playlistService.value;
  }
}
