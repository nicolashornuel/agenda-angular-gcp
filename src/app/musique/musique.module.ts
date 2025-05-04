import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ListSavedComponent } from './components/list-saved/list-saved.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { WatchModalComponent } from './components/watch-modal/watch-modal.component';
import { IframeTrackerDirective } from './directives/iframe-tracker.directive';
import { PageMusiqueComponent } from './page/page-musique.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: PageMusiqueComponent,
/*     children: [
      {
        path: '',
        redirectTo: 'playlist',
        pathMatch: 'full'
      },
      { path: 'playlist', component: ListSavedComponent },
      { path: 'search', component: SearchResultComponent }
    ] */
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusiqueRoutingModule { }

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
    MusiqueRoutingModule,
    SharedModule,
  ]
})
export class MusiqueModule { }