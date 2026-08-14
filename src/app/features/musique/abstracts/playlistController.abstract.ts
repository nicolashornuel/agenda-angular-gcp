import { inject } from '@angular/core';
import { VideoGAPI } from '@features/musique/models/musique.interface';
import { DestroyService } from '@shared/services/destroy.service';
import { PlaylistSummary, VISITOR_PLAYLIST, VISITOR_PLAYLIST_ID } from 'app/features/left-bar/models/left-bar.model';
import { takeUntil } from 'rxjs';
import { MusiquePlaylistService, MusiquePlaylistSummaryService } from '../services/musique.observable.service';

export abstract class PlaylistController {
  protected destroy$ = inject(DestroyService);
  protected playlistSummaryService = inject(MusiquePlaylistSummaryService);
  protected playlistService = inject(MusiquePlaylistService);
  protected readonly playlistSummary$ = this.playlistSummaryService.get$.pipe(takeUntil(this.destroy$));
  protected readonly playlist$ = this.playlistService.get$.pipe(takeUntil(this.destroy$));

  protected loadPlaylist(playlistSummary?: PlaylistSummary): void {
    if (!playlistSummary?.id) {
      this.playlistService.clear();
      return;
    }

    if (playlistSummary.id === VISITOR_PLAYLIST_ID) {
      this.playlistService.loadInMemory(VISITOR_PLAYLIST);
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

  protected async onRemovePlaylistSummary(id: string): Promise<void> {
    await this.playlistSummaryService.remove(id);
    await this.playlistService.removePlaylist(id);
  }

  protected async removePlaylist(id: string): Promise<void> {
    await this.playlistSummaryService.remove(id);
    await this.playlistService.removePlaylist(id);
    this.playlistService.clear();
  }
}
