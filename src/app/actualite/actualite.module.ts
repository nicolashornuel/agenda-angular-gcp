import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActualiteRoutingModule } from './actualite-routing.module';
import { PageActuComponent } from './page/page-actu.component';
import { SharedModule } from "../shared/shared.module";
import { TabContentComponent } from './components/tab-content/tab-content.component';


@NgModule({
    declarations: [
        PageActuComponent,
        TabContentComponent
    ],
    imports: [
        CommonModule,
        ActualiteRoutingModule,
        SharedModule
    ]
})
export class ActualiteModule { }
