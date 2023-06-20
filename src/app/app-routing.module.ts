import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: 'sign-in', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'agenda', loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaModule)},
  {path: 'memo', loadChildren: () => import('./memo/memo.module').then(m => m.MemoModule)},
  {path: '**', redirectTo: '/sign-in', pathMatch: 'full'},
  {path: ' ', redirectTo: '/sign-in', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
