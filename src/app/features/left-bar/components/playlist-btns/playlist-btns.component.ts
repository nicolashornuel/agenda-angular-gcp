import { Component, inject, OnInit } from '@angular/core';
import { PlaylistSummary } from 'app/features/left-bar/models/left-bar.model';
import {
  FirestorePlaylistService,
  FirestoreVideoCenterService
} from 'app/features/left-bar/services/left-bar.firestore.service';
import { PlaylistController } from '../abstracts/playlist-controller.abstract';
import { PlayerState } from '@core/services/youtube-player.service';

@Component({
  selector: 'app-playlist-btns',
  templateUrl: './playlist-btns.component.html',
  styleUrls: ['./playlist-btns.component.scss']
})
export class PlaylistBtnsComponent extends PlaylistController implements OnInit {
  public playlistSelect: any = {};
  protected currentPlaylistId?: string;
  protected isPlaying: boolean = false;

  protected firestorePlaylistService = inject(FirestorePlaylistService);
  protected firestoreVideoCenterService = inject(FirestoreVideoCenterService);

  ngOnInit(): void {
    this.playlistSummary$.subscribe(list => this.initPlaylistSelect(list));
    this.playlist$.subscribe(playlist => (this.currentPlaylistId = playlist.id));
    this.playing$.subscribe(playing => this.isPlaying = playing);
    this.playerState$.subscribe(state => this.isPlaying = state === PlayerState.Playing);
  }

  private initPlaylistSelect(list: PlaylistSummary[]) {
    this.playlistSelect.options = this.buildOptions(list);
    if (!this.playlistService.value.id) this.loadPlaylist(list[0]);
  }

  private buildOptions(list: PlaylistSummary[]) {
    return [
      ...list.map(item => ({
        summary: item,
        load: (summary: PlaylistSummary) =>
          this.firestorePlaylistService
            .getById(summary.id!)
            .subscribe(playlist => this.playlistService.set$(playlist ?? { id: summary.id, videos: [] }))
      })),
      {
        summary: {
          id: 'latest',
          name: 'Dernier ajout'
        },
        load: (summary: PlaylistSummary) =>
          this.firestoreVideoCenterService
            .getLatest()
            .subscribe(videos => this.playlistService.set$({ ...summary, videos }))
      },
      {
        summary: {
          id: 'topRated',
          name: 'Meilleur note'
        },
        load: (summary: PlaylistSummary) =>
          this.firestoreVideoCenterService
            .getTopRated()
            .subscribe(videos => this.playlistService.set$({ ...summary, videos }))
      }
    ];
  }

  onTooglePlay(): void {
    this.playingService.set$(!this.isPlaying);
  }
}
