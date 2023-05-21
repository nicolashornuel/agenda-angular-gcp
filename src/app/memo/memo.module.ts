import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemoRoutingModule } from './memo-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ToDoComponent } from './components/to-do/to-do.component';
import { CoursesComponent } from './components/courses/courses.component';


@NgModule({
  declarations: [
    ToDoComponent,
    CoursesComponent
  ],
  imports: [
    CommonModule,
    MemoRoutingModule,
    SharedModule
  ]
})
export class MemoModule { }
