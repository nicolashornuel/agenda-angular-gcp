import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ActualiteRoutingModule } from './actualite-routing.module';
import { ListFeedComponent } from './components/list-feed/list-feed.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { PageActuComponent } from './page/page-actu.component';

@NgModule({
  declarations: [PageActuComponent, TabContentComponent, ListFeedComponent],
  imports: [CommonModule, ActualiteRoutingModule, SharedModule]
})
export class ActualiteModule {}
