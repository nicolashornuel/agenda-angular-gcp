import { Component, ComponentRef, inject, OnInit } from '@angular/core';
import { DeezerAlbum, DeezerPlaylist, DeezerService, DeezerTrack } from '@core/services/deezer.service';
import { Nameable } from '@shared/models/fieldSet.model';
import {
  ActionSet,
  CellRenderers,
  ColumnCustom,
  ColumnHtml,
  ColumnSet,
  ColumnString,
  TableSet
} from '@shared/models/tableSet.interface';
import { DurationToPipe } from '@shared/pipes/duration-to.pipe';
import { DeezerPlayingBtnComponent } from '../deezer-playing-btn/deezer-playing-btn.component';
import { Router } from '@angular/router';
import { clamp } from 'date-fns';
import { InputStarComponent } from '@shared/components/input-star/input-star.component';

@Component({
  selector: 'app-deezer',
  templateUrl: './deezer.component.html',
  styleUrls: ['./deezer.component.scss']
})
export class DeezerComponent implements OnInit {
  public loading: boolean = false;
  public playlist?: DeezerPlaylist;
  private deezerService = inject(DeezerService);
  private durationPipe = inject(DurationToPipe);
  private router = inject(Router);
  public favoritePlaylists: { name: string; id: string }[] = [];
  public selectedPlaylist?: { name: string; id: string };

  public tableSet: TableSet = {
    verticaltextHeader: false,
    hover: false,
    height: 'calc(100vh - 256px)',
    columnSet: [
      new ColumnHtml({ name: '', key: 'album' } as Nameable, true, (row: any, col: ColumnSet) => {
        const src = (row[col.key] as DeezerAlbum).cover_medium;
        return `<img width="40px" src=${src} />`;
      }),
      new ColumnString({ name: 'Titre', key: 'title' } as Nameable, true).setWidth('20%'),
      new ColumnHtml({ name: 'Artiste', key: 'artist' } as Nameable, true, CellRenderers.toName()).setWidth('20%'),
      new ColumnHtml({ name: 'Durée', key: 'duration' } as Nameable, true, (row, col) =>
        this.durationPipe.transform(row[col.key])
      ).setWidth('10%'),
      new ColumnCustom({ name: 'Popularité', key: 'rank' } as Nameable, true, this.toScoring()).setWidth('40%'),
      new ColumnCustom({ name: 'lecture', key: 'preview' } as Nameable, true, this.toPlayingBtn())
    ],
    actionSet: [new ActionSet('fas fa-magnifying-glass', (row: DeezerTrack, index) => this.search(row))],
    data: []
  };

  ngOnInit(): void {
    this.favoritePlaylists = this.deezerService.favoritePlaylists;
    this.loadPlaylist(this.favoritePlaylists[0]);
  }

  public loadPlaylist(playlist: { name: string; id: string }) {
    this.selectedPlaylist = playlist;
    this.loading = true;
    this.deezerService
      .getPlaylist(playlist.id)
      .then((response: DeezerPlaylist) => {
        this.playlist = response;
        this.tableSet.data = response.tracks;
      })
      .finally(() => (this.loading = false));
  }

  public toPlayingBtn() {
    return {
      component: DeezerPlayingBtnComponent,
      bind: (row: any, key: string, componentRef: ComponentRef<DeezerPlayingBtnComponent>) => {
        componentRef.instance.src = row[key];
      }
    };
  }

  public toScoring() {
    return {
      component: InputStarComponent,
      bind: (row: any, key: string, componentRef: ComponentRef<InputStarComponent>) => {
        const rank = row[key];
        const score = this.rankToScore(rank, 950_000);
        componentRef.instance.value = score;
        componentRef.instance.readonly = true;
      }
    };
  }

  public search(row: DeezerTrack) {
    const keyword = row.title + ' ' + row.artist.name;
    this.router.navigate(['/musique'], { queryParams: { keyword } });
  }

  public rankToScore(rank: number, threshold = 750_000): number {
    const maxRank = 1_000_000;
    const normalizedRank = Math.max(threshold, Math.min(rank, maxRank));
    const score = ((normalizedRank - threshold) / (maxRank - threshold)) * 5;
    return Math.round(score);
  }
}
