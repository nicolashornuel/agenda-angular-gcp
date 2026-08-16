import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { RssItem } from '@core/services/rss.service';
import { TabParam } from '@shared/models/tabParam.interface';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { PageActuComponent } from './page/page-actu.component';
import { RssFeedResolverService } from './services/actualite.resolver.service';
import { RssFeed } from './models/actualite.model';

const tabsResolver: ResolveFn<TabParam[]> = () => inject(RssFeedResolverService).getTabs();

const tabDataResolver: ResolveFn<RssItem[]> = route => inject(RssFeedResolverService).getItems(route.paramMap.get(RssFeed.SLUG_KEY.key)!);

const routes: Routes = [
  {
    path: '',
    component: PageActuComponent,
    resolve: {
      tabs: tabsResolver
    },
    children: [
      {
        path: ':slug',
        component: TabContentComponent,
        runGuardsAndResolvers: 'paramsChange',
        resolve: {
          items: tabDataResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualiteRoutingModule {}
