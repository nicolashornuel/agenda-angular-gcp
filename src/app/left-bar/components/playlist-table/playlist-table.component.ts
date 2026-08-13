import { Component, ComponentRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { Nameable } from '@shared/models/fieldSet.model';
import { ActionSet, ColumnCustom, ColumnString, TableSet } from '@shared/models/tableSet.interface';
import { LeftBarIsOpenedService } from '@shared/services/shared.observable.service';
import { PlaylistVideo } from 'app/left-bar/models/left-bar.model';
import { map } from 'rxjs';
import { PlaylistController } from '../abstracts/playlist-controller.abstract';
import { ChannelCellComponent } from '../channel-cell/channel-cell.component';
import { StateCellComponent } from '../state-cell/state-cell.component';

@Component({
  selector: 'app-playlist-table',
  templateUrl: './playlist-table.component.html',
  styleUrls: ['./playlist-table.component.scss']
})
export class PlaylistTableComponent extends PlaylistController implements OnInit {
  private router = inject(Router);
  private leftBarIsOpenedService = inject(LeftBarIsOpenedService);
  public loading: boolean = false;
  public tableSet: TableSet = {
    verticaltextHeader: false,
    hover: false,
    draggable: true,
    draggableSave: () => this.playlistService.move(),
    scrollCurrent: (row: PlaylistVideo) => this.currentVideo$.pipe(map(video => video === row)),
    height: 'calc(100vh - 600px)',
    columnSet: [
      new ColumnCustom({ name: 'Ordre' }, true, this.toIndexBadge()).setWidth('5%'),
      new ColumnString({ name: 'Titre', key: 'title' } as Nameable, true),
      new ColumnCustom(
        { name: 'Chaine Youtube', key: 'channelTitle' } as Nameable,
        true,
        this.toChannelLink('Voir la chaîne', 'channelId')
      ),
      new ColumnCustom({ name: 'Lecture' }, true, this.toState()).setWidth('5%')
    ],
    data: [],
    actionSet: [new ActionSet(ActionSet.DELETE, (row, index) => this.playlistService.remove(row))]
  };

  ngOnInit(): void {
    this.playlist$.subscribe(list => (this.tableSet.data = list.videos!));
  }

  public toState() {
    return {
      component: StateCellComponent,
      bind: (row: any, key: string, componentRef: ComponentRef<StateCellComponent>) => {
        componentRef.instance.row = row;
      }
    };
  }

  public toIndexBadge() {
    return {
      component: BadgeComponent,
      bind: (row: any, key: string, componentRef: ComponentRef<BadgeComponent>, index: number) => {
        componentRef.instance.text = index + 1;
        componentRef.instance.top = '8px';
        componentRef.instance.left = '8px';
        componentRef.instance.position = 'relative';
      }
    };
  }

  public toChannelLink(tooltip: string, keyId: string) {
    return {
      component: ChannelCellComponent,
      bind: (row: any, key: string, componentRef: ComponentRef<ChannelCellComponent>) => {
        componentRef.instance.data = {
          text: row[key],
          action: () => this.openChannel(row[keyId], row[key]),
          tooltip
        };
      }
    };
  }

  private openChannel(channelId: string, channelTitle: string): void {
    this.router.navigate(['/musique'], { queryParams: { channelId, channelTitle } });
    this.leftBarIsOpenedService.set$(false);
  }
}
