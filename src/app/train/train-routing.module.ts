import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/services/auth-guard.guard';
import { ListeArrivalComponent, ListeDepartureComponent } from './components/liste-next/liste-next.component';
import { ListeReservationComponent } from './components/liste-reservation/liste-reservation.component';
import { PageTrainComponent } from './page/page-train.component';

const routes: Routes = [
  {
    path: '',
    component: PageTrainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'reservations',
        pathMatch: 'full'
      },
      { path: 'reservations', component: ListeReservationComponent },
      { path: 'reservations/:id', component: ListeReservationComponent },
      { path: 'arrivals', component: ListeArrivalComponent },
      { path: 'arrivals/:id', component: ListeArrivalComponent },
      { path: 'departures', component: ListeDepartureComponent },
      { path: 'departures/:id', component: ListeDepartureComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainRoutingModule {}
