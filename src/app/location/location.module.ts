import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { PageLocationComponent } from './page/page-location.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    PageLocationComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
    LeafletModule,
    SharedModule
  ]
})
export class LocationModule { }
