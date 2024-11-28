import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/services/auth-guard.guard';
import { ListeNextComponent } from './components/liste-next/liste-next.component';
import { ListeReservationComponent } from './components/liste-reservation/liste-reservation.component';
import { ListeTrajetComponent } from './components/liste-trajet/liste-trajet.component';
import { PageTrainComponent } from './page/page-train.component';

const routes: Routes = [
  {
    path: '',
    component: PageTrainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'trajets',
        pathMatch: 'full'
      },
      { path: 'trajets', component: ListeTrajetComponent },
      { path: 'reservations', component: ListeReservationComponent },
      { path: 'reservations/:id', component: ListeReservationComponent },
      { path: 'nexts', component: ListeNextComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainRoutingModule {}
