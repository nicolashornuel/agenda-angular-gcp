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
  {path: 'actualite', loadChildren: () => import('./actualite/actualite.module').then(m => m.ActualiteModule)},
  {path: 'train', loadChildren: () => import('./train/train.module').then(m => m.TrainModule)},
  {path: 'trading', loadChildren: () => import('./trading/trading.module').then(m => m.TradingModule)},
  {path: 'location', loadChildren: () => import('./location/location.module').then(m => m.LocationModule)},
  {path: 'meteo', loadChildren: () => import('./meteo/meteo.module').then(m => m.MeteoModule)},
  {path: '**', redirectTo: '/sign-in', pathMatch: 'full'},
  {path: ' ', redirectTo: '/sign-in', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
