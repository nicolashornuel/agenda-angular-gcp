import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBirthdayComponent } from './components/list-birthday/list-birthday.component';
import { ListEventComponent } from './components/list-event/list-event.component';
import { TabCalendarComponent } from './components/tab-calendar/tab-calendar.component';
import { PageAgendaComponent } from './page/page-agenda.component';
import { ListCheckboxComponent } from './components/list-checkbox/list-checkbox.component';

const routes: Routes = [
  { path: '', component: PageAgendaComponent,
    children: [
      {
        path: '',
        redirectTo: 'calendar',
        pathMatch: 'full'
      },
      { path: 'calendar', component: TabCalendarComponent },
      { path: 'checkbox', component: ListCheckboxComponent },
      { path: 'birthday', component: ListBirthdayComponent },
      { path: 'event', component: ListEventComponent }
    ]
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
