import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ListSavedComponent } from './components/list-saved/list-saved.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { WatchModalComponent } from './components/watch-modal/watch-modal.component';
import { IframeTrackerDirective } from './directives/iframe-tracker.directive';
import { PageMusiqueComponent } from './page/page-musique.component';
import { MusiqueRoutingModule } from './musique-routing.module';
import { DropPlaylistComponent } from './components/drop-playlist/drop-playlist.component';
import { DragCellComponent } from './components/drag-cell/drag-cell.component';
import {
  FirestorePlaylistService,
  FirestorePlaylistSummaryService,
  VideoService
} from './services/musique.firestore.service';
import { PlaylistService, PlaylistSummaryService, TabResultService } from './services/musique.observable.service';
import { DeezerComponent } from './components/deezer/deezer.component';
import { DurationToPipe } from '@shared/pipes/duration-to.pipe';
import { DeezerPlayingBtnComponent } from './components/deezer-playing-btn/deezer-playing-btn.component';

@NgModule({
  declarations: [
    PageMusiqueComponent,
    SearchResultComponent,
    ListSavedComponent,
    WatchModalComponent,
    IframeTrackerDirective,
    DropPlaylistComponent,
    DragCellComponent,
    DeezerComponent,
    DeezerPlayingBtnComponent
  ],
  imports: [CommonModule, MusiqueRoutingModule, SharedModule],
  providers: [
    VideoService,
    FirestorePlaylistService,
    FirestorePlaylistSummaryService,
    TabResultService,
    PlaylistSummaryService,
    PlaylistService,
    DurationToPipe
  ]
})
export class MusiqueModule {}
