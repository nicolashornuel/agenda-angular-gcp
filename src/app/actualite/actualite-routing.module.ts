import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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