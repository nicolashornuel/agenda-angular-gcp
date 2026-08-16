import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActualiteRoutingModule } from './actualite-routing.module';
import { ListFeedComponent } from './components/list-feed/list-feed.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { PageActuComponent } from './page/page-actu.component';
import { SharedModule } from '@shared/shared.module';
import { FirestoreRssFeedService } from './services/actualite.firestore.service';
import { RssFeedResolverService } from './services/actualite.resolver.service';

@NgModule({
  declarations: [PageActuComponent, TabContentComponent, ListFeedComponent],
  imports: [CommonModule, ActualiteRoutingModule, SharedModule],
  providers: [FirestoreRssFeedService, RssFeedResolverService]
})
export class ActualiteModule {}
