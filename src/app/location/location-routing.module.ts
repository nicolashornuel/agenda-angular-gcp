import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLocationComponent } from './page/page-location.component';
import { ListComponent } from './components/list/list.component';
import { MapComponent } from './components/map/map.component';


const routes: Routes = [
  {path: '', component: PageLocationComponent,
      children: [
        {
          path: '',
          redirectTo: 'map',
          pathMatch: 'full'
        },
        { path: 'map', component: MapComponent },
        { path: 'list', component: ListComponent }
      ]
     },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
