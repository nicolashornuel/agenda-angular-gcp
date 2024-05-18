import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ListSavedComponent } from './components/list-saved/list-saved.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { WatchModalComponent } from './components/watch-modal/watch-modal.component';
import { IframeTrackerDirective } from './directives/iframe-tracker.directive';
import { musiqueRoutingModule } from './musique-routing.module';
import { PageMusiqueComponent } from './page/page-musique.component';

@NgModule({
  declarations: [
    PageMusiqueComponent,
    SearchResultComponent,
    ListSavedComponent,
    WatchModalComponent,
    IframeTrackerDirective
  ],
  imports: [
    CommonModule,
    musiqueRoutingModule,
    SharedModule,
  ]
})
export class MusiqueModule { }
