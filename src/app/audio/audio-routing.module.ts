import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAudioComponent } from './page/page-audio.component';

const routes: Routes = [{ path: '', component: PageAudioComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AudioRoutingModule { }
