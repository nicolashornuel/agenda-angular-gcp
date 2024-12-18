import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/services/auth-guard.guard';
import { PageMemoComponent } from './page/page-memo.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';

const routes: Routes = [
  {
    path: '',
    component: PageMemoComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'maison',
        pathMatch: 'full'
      },
      { path: 'romane', component: TabContentComponent },
      { path: 'baptiste', component: TabContentComponent },
      { path: 'emilie', component: TabContentComponent },
      { path: 'nicolas', component: TabContentComponent },
      { path: 'maison', component: TabContentComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemoRoutingModule {}
