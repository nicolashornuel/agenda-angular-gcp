import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftBarComponent } from './left-bar.component';
import { SharedModule } from '@shared/shared.module';
import { PlayerComponent } from './components/player/player.component';
import { PlaylistBtnsComponent } from './components/playlist-btns/playlist-btns.component';
import { PlaylistTableComponent } from './components/playlist-table/playlist-table.component';
import { StateCellComponent } from './components/state-cell/state-cell.component';
import { PlayingBarComponent } from './components/playing-bar/playing-bar.component';
import { ChannelCellComponent } from './components/channel-cell/channel-cell.component';
import { PageComponent } from './page/page.component';
import {
  FirestorePlaylistService,
  FirestorePlaylistSummaryService,
  FirestoreVideoCenterService
} from './services/left-bar.firestore.service';
import {
  PlaylistSummaryService,
  PlaylistService,
  CurrentVideoService,
  RepeatModeService,
  SuffleService,
  PlayingService
} from './services/left-bar.observable.service';

const Elements = [
  PageComponent,
  LeftBarComponent,
  PlayerComponent,
  PlaylistBtnsComponent,
  PlaylistTableComponent,
  StateCellComponent,
  PlayingBarComponent,
  ChannelCellComponent
];
@NgModule({
  declarations: Elements,
  imports: [CommonModule, SharedModule],
  exports: Elements,
  providers: [
    FirestorePlaylistService,
    FirestorePlaylistSummaryService,
    FirestoreVideoCenterService,
    PlaylistSummaryService,
    PlaylistService,
    CurrentVideoService,
    RepeatModeService,
    SuffleService,
    PlayingService
  ]
})
export class LeftBarModule {}
