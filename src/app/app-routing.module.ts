import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {authGuard} from './core/services/auth-guard.guard';

const routes: Routes = [
  {path: 'sign-in', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'agenda',
    loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaModule),
    canMatch: [authGuard]
  },
  {path: 'memo', loadChildren: () => import('./memo/memo.module').then(m => m.MemoModule), canMatch: [authGuard]},
  {path: 'musique', loadChildren: () => import('./musique/musique.module').then(m => m.MusiqueModule)},
  {path: 'trading', loadChildren: () => import('./trading/trading.module').then(m => m.TradingModule)},
  {path: '**', redirectTo: '/sign-in', pathMatch: 'full'},
  {path: ' ', redirectTo: '/sign-in', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
