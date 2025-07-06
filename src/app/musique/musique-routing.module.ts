import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { PageMusiqueComponent } from './page/page-musique.component';


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