import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAgendaComponent } from './page/page-agenda.component';
import { TabCalendarComponent } from './components/tab-calendar/tab-calendar.component';
import { TabRecurrentEventComponent } from './components/tab-recurrent-event/tab-recurrent-event.component';

const routes: Routes = [
  { path: '', component: PageAgendaComponent,
    children: [
      {
        path: '',
        redirectTo: 'calendar',
        pathMatch: 'full'
      },
      { path: 'calendar', component: TabCalendarComponent },
      { path: 'recurrent-event', component: TabRecurrentEventComponent },
      { path: 'family', component: TabRecurrentEventComponent },
      { path: 'family/:id', component: TabRecurrentEventComponent }
    ]
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
