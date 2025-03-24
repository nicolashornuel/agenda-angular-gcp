import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageActuComponent } from './page/page-actu.component';
import { SharedModule } from '../shared/shared.module';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { ListFeedComponent } from './components/list-feed/list-feed.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PageActuComponent,
    children: [
      { path: ':slug', component: TabContentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualiteRoutingModule {}

@NgModule({
  declarations: [PageActuComponent, TabContentComponent, ListFeedComponent],
  imports: [CommonModule, ActualiteRoutingModule, SharedModule]
})
export class ActualiteModule {}
