import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabCalendarComponent } from './components/tab-calendar/tab-calendar.component';
import { TabRecurrentEventComponent } from './components/tab-recurrent-event/tab-recurrent-event.component';
import { PageAgendaComponent } from './page/page-agenda.component';
import { ListBirthdayComponent } from './components/list-birthday/list-birthday.component';
import { ListEventComponent } from './components/list-event/list-event.component';

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
      { path: 'birthday', component: ListBirthdayComponent },
      { path: 'event', component: ListEventComponent },
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
