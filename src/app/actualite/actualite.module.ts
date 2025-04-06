import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ListFeedComponent } from './components/list-feed/list-feed.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { PageActuComponent } from './page/page-actu.component';

const routes: Routes = [
  {
    path: '',
    component: PageActuComponent,
    children: [
      { path: ':slug', component: TabContentComponent },
      { path: '', component: TabContentComponent }
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
