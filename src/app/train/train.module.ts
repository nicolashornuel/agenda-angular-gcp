import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { EditionTrajetComponent } from './components/edition-trajet/edition-trajet.component';
import { ListeTrajetComponent } from './components/liste-trajet/liste-trajet.component';
import { TrainRoutingModule } from './train-routing.module';
import { PageTrainComponent } from './page/page-train.component';
import { ListeReservationComponent } from './components/liste-reservation/liste-reservation.component';
import { EditionReservationComponent } from './components/edition-reservation/edition-reservation.component';
import { ListeNextComponent } from './components/liste-next/liste-next.component';
import { ListeArretComponent } from './components/liste-arret/liste-arret.component';


@NgModule({
  declarations: [
    EditionTrajetComponent,
    ListeTrajetComponent,
    PageTrainComponent,
    ListeReservationComponent,
    EditionReservationComponent,
    ListeNextComponent,
    ListeArretComponent
  ],
  imports: [
    CommonModule,
    TrainRoutingModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class TrainModule { }
