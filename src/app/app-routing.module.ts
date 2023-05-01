import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'agenda', loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaModule) },
  { path: '**', redirectTo: '/agenda', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
