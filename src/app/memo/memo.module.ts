import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemoRoutingModule } from './memo-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ToDoComponent } from './components/to-do/to-do.component';


@NgModule({
  declarations: [
    ToDoComponent,
  ],
  imports: [
    CommonModule,
    MemoRoutingModule,
    SharedModule
  ]
})
export class MemoModule { }
