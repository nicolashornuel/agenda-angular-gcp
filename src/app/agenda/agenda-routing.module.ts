import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAgendaComponent } from './page/page-agenda.component';

const routes: Routes = [{ path: '', component: PageAgendaComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
