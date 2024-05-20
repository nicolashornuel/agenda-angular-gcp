import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageMusiqueComponent } from './page/page-musique.component';

const routes: Routes = [
  { path: '', component: PageMusiqueComponent },
  { path: 'search/:keyword', component: PageMusiqueComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusiqueRoutingModule { }
