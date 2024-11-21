import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainRoutingModule } from './train-routing.module';
import { EditionComponent } from './components/edition/edition.component';
import { SharedModule } from '@shared/shared.module';
import { PageTrainComponent } from './page/page-train.component';
import { ListeComponent } from './components/liste/liste.component';


@NgModule({
  declarations: [
    EditionComponent,
    PageTrainComponent,
    ListeComponent
  ],
  imports: [
    CommonModule,
    TrainRoutingModule,
    SharedModule
  ]
})
export class TrainModule { }
