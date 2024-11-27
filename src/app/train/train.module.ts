import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { EditionTrajetComponent } from './components/edition-trajet/edition-trajet.component';
import { ListeTrajetComponent } from './components/liste-trajet/liste-trajet.component';
import { TrainRoutingModule } from './train-routing.module';
import { PageTrainComponent } from './page/page-train.component';
import { ListeReservationComponent } from './components/liste-reservation/liste-reservation.component';
import { ListeDirective } from './abstracts/listeDirective.abstract';
import { EditionReservationComponent } from './components/edition-reservation/edition-reservation.component';


@NgModule({
  declarations: [
    EditionTrajetComponent,
    ListeTrajetComponent,
    PageTrainComponent,
    ListeReservationComponent,
    EditionReservationComponent
  ],
  imports: [
    CommonModule,
    TrainRoutingModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class TrainModule { }
