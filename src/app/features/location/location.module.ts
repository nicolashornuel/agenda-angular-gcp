import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { PageLocationComponent } from './page/page-location.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SharedModule } from '@shared/shared.module';
import { ListComponent } from './components/list/list.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    PageLocationComponent,
    ListComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
    LeafletModule,
    SharedModule
  ]
})
export class LocationModule { }
