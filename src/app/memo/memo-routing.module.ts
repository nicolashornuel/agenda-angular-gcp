import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'app/core/services/auth-guard.guard';
import { PageMemoComponent } from './page/page-memo.component';

const routes: Routes = [
  {path: 'todo', component: PageMemoComponent, canActivate: [authGuard]},
  {path: '', redirectTo: 'todo', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemoRoutingModule {}
