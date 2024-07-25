import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLocationComponent } from './page/page-location.component';


const routes: Routes = [
  {path: '', component: PageLocationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
