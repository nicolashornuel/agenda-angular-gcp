import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/services/auth-guard.guard';
import { PageTrainComponent } from './page/page-train.component';

const routes: Routes = [
  {path: '', component: PageTrainComponent, canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainRoutingModule { }
