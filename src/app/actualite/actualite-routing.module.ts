import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageActuComponent } from './page/page-actu.component';

const routes: Routes = [
  {path: '', component: PageActuComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualiteRoutingModule { }
