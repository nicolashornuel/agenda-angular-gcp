import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageMeteoComponent } from './page/page-meteo.component';

const routes: Routes = [
  {path: '', component: PageMeteoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeteoRoutingModule { }