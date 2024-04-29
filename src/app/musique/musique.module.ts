import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { musiqueRoutingModule } from './musique-routing.module';
import { PageMusiqueComponent } from './page/page-musique.component';
import { SharedModule } from '@shared/shared.module';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { RadioPlayerComponent } from './components/radio-player/radio-player.component';
import { GraphQLModule } from '../graphql.module';
import { RssFluxComponent } from './components/rss-flux/rss-flux.component';
import { ListSavedComponent } from './components/list-saved/list-saved.component';
import { WatchModalComponent } from './components/watch-modal/watch-modal.component';

@NgModule({
  declarations: [
    PageMusiqueComponent,
    SearchResultComponent,
    RadioPlayerComponent,
    RssFluxComponent,
    ListSavedComponent,
    WatchModalComponent
  ],
  imports: [
    CommonModule,
    musiqueRoutingModule,
    SharedModule,
    GraphQLModule
  ]
})
export class MusiqueModule { }
