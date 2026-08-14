import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTradingComponent } from './page/page-trading.component';

const routes: Routes = [
  { path: '', component: PageTradingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradingRoutingModule { }
