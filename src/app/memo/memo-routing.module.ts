import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/services/auth-guard.guard';
import { PageMemoComponent } from './page/page-memo.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { ToDoComponent } from './components/to-do/to-do.component';

const routes: Routes = [
  {
    path: '',
    component: PageMemoComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'romane',
        pathMatch: 'full'
      },
      { path: 'romane', component: TabContentComponent },
      { path: 'baptiste', component: TabContentComponent },
      { path: 'emilie', component: TabContentComponent },
      { path: 'nicolas', component: TabContentComponent },
      { path: 'maison', component: TabContentComponent },
      { path: 'to-do', component: ToDoComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemoRoutingModule {}
