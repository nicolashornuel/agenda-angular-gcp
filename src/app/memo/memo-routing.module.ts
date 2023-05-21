import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToDoComponent } from './components/to-do/to-do.component';
import { CoursesComponent } from './components/courses/courses.component';

const routes: Routes = [
  { path: 'todo', component: ToDoComponent },
  { path: 'courses', component: CoursesComponent },
  { path: '**', redirectTo: 'todo', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemoRoutingModule { }
