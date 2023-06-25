import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ToDoComponent} from './components/to-do/to-do.component';
import {CoursesComponent} from './components/courses/courses.component';
import {authGuard} from 'app/core/services/auth-guard.guard';

const routes: Routes = [
  {path: 'todo', component: ToDoComponent, canActivate: [authGuard]},
  {path: 'courses', component: CoursesComponent, canActivate: [authGuard]},
  {path: '', redirectTo: 'todo', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemoRoutingModule {}
