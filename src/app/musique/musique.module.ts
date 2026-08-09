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
import { LeftBarModule } from 'app/left-bar/left-bar.module';

@NgModule({
  declarations: [
    PageMusiqueComponent,
    SearchResultComponent,
    ListSavedComponent,
    WatchModalComponent,
    IframeTrackerDirective,
    DropPlaylistComponent,
    DragCellComponent
  ],
  imports: [
    CommonModule,
    MusiqueRoutingModule,
    SharedModule,
    LeftBarModule
  ]
})
export class MusiqueModule { }