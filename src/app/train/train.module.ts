import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { DisruptionComponent } from './components/disruption/disruption.component';
import { EditionReservationComponent } from './components/edition-reservation/edition-reservation.component';
import { ListeArretComponent } from './components/liste-arret/liste-arret.component';
import { ListeArrivalComponent, ListeDepartureComponent, ListeNextComponent } from './components/liste-next/liste-next.component';
import { ListeReservationComponent } from './components/liste-reservation/liste-reservation.component';
import { PageTrainComponent } from './page/page-train.component';
import { TrainRoutingModule } from './train-routing.module';


@NgModule({
  declarations: [
    PageTrainComponent,
    ListeReservationComponent,
    EditionReservationComponent,
    ListeNextComponent,
    ListeArretComponent,
    ListeArrivalComponent,
    ListeDepartureComponent,
    DisruptionComponent
  ],
  imports: [
    CommonModule,
    TrainRoutingModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class TrainModule { }
