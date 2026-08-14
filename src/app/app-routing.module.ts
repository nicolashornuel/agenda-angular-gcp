import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {authGuard} from './core/services/auth-guard.guard';

const routes: Routes = [
  {path: 'sign-in', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'agenda',
    loadChildren: () => import('./features/agenda/agenda.module').then(m => m.AgendaModule),
    canMatch: [authGuard]
  },
  {path: 'memo', loadChildren: () => import('./features/memo/memo.module').then(m => m.MemoModule), canMatch: [authGuard]},
  {path: 'musique', loadChildren: () => import('./features/musique/musique.module').then(m => m.MusiqueModule)},
  {path: 'actualite', loadChildren: () => import('./features/actualite/actualite.module').then(m => m.ActualiteModule)},
  {path: 'train', loadChildren: () => import('./features/train/train.module').then(m => m.TrainModule)},
  {path: 'trading', loadChildren: () => import('./features/trading/trading.module').then(m => m.TradingModule)},
  {path: 'location', loadChildren: () => import('./features/location/location.module').then(m => m.LocationModule)},
  {path: 'meteo', loadChildren: () => import('./features/meteo/meteo.module').then(m => m.MeteoModule)},
  {path: '**', redirectTo: '/sign-in', pathMatch: 'full'},
  {path: ' ', redirectTo: '/sign-in', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
