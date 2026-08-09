import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { Selectable } from '@shared/models/fieldSet.model';
import { Modal, ModalParam } from '@shared/models/modalParam.interface';
import { ModalService } from '@shared/services/shared.observable.service';
import { PlaylistController } from 'app/left-bar/components/abstracts/playlist-controller.abstract';
import { PlaylistSummary, PlaylistVideo } from 'app/left-bar/models/left-bar.model';

@Component({
  selector: 'app-drop-playlist',
  templateUrl: './drop-playlist.component.html',
  styleUrls: ['./drop-playlist.component.scss']
})
export class DropPlaylistComponent extends PlaylistController implements OnInit {
  public videos?: PlaylistVideo[];
  public playlists: string[] = [];
  public playlistSelect: any = {};
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.playlistSummary$.subscribe(list => this.initPlaylistSelect(list));
    this.playlist$.subscribe(list => {
      this.videos = list.videos ?? [];
      this.refreshPlaylistSelect(list.id);
    });
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

    if (!this.playlistService.value.id) this.loadPlaylist(list[0]);
  }

  private refreshPlaylistSelect(playlistId?: string) {
    if (!playlistId) {
      this.playlistSelect.selected = undefined;
      return;
    }
    this.playlistSelect.selected = this.playlistSelect.options?.find(
      (summary: PlaylistSummary) => summary.id === playlistId
    );
  }

  public onOpenModal(templateRef: TemplateRef<Modal>): void {
    const selectable: Selectable<string> = {
      name: 'Nom de la liste de lecture',
      value: ''
    };
    const modalParam: ModalParam<Selectable<string>> = {
      title: `Création d'une liste de lecture`,
      context: { $implicit: selectable },
      template: templateRef
    };
    this.modalService.set$(modalParam);
  }

  public async onCreate(input: Selectable<string>): Promise<void> {
    await this.createPlaylist(input.value!);
    this.modalService.set$(undefined);
  }
}
