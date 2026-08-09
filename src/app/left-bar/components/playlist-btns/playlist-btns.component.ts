import { Component, OnInit } from '@angular/core';
import { PlaylistSummary } from 'app/left-bar/models/left-bar.model';
import { PlaylistController } from '../abstracts/playlist-controller.abstract';

@Component({
  selector: 'app-playlist-btns',
  templateUrl: './playlist-btns.component.html',
  styleUrls: ['./playlist-btns.component.scss']
})
export class PlaylistBtnsComponent extends PlaylistController implements OnInit {

  public playlistSelect: any = {};
  protected currentPlaylistId?: string;
  
  ngOnInit(): void {
    this.playlistSummary$.subscribe(list => this.initPlaylistSelect(list));
    this.playlist$.subscribe(playlist => this.currentPlaylistId = playlist.id);
  }

    private initPlaylistSelect(list: PlaylistSummary[]) {
      this.playlistSelect.label = 'Playlist disponible';
      this.playlistSelect.options = list;
      if (list.length === 0) {
        this.playlistSelect.selected = undefined;
        this.playlistService.clear();
        return;
      }
      this.playlistSelect.selected = list[0];
      this.playlistSelect.onChange = (playlist: PlaylistSummary) => this.loadPlaylist(playlist);
      this.loadPlaylist(list[0]);
    }
}
