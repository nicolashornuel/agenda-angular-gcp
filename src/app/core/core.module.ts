import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

import { EventService } from './services/event.service';
import { HolidayService } from './services/holiday.service';
import { ModalDirective } from './directives/modal.directive';

@NgModule({
  declarations: [
    NavbarComponent,
    ModalDirective
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [NavbarComponent],
  providers: [EventService, HolidayService]
})
export class CoreModule { }
