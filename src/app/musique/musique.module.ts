import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { musiqueRoutingModule } from './musique-routing.module';
import { PageMusiqueComponent } from './page/page-musique.component';
import { SharedModule } from '@shared/shared.module';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { GraphQLModule } from '../graphql.module';
import { RssFluxComponent } from './components/rss-flux/rss-flux.component';
import { ListSavedComponent } from './components/list-saved/list-saved.component';
import { WatchModalComponent } from './components/watch-modal/watch-modal.component';
import { AudioHandlerComponent } from './components/audio-handler/audio-handler.component';
import { AudioNodeAnalyserWaveComponent } from './components/audio-node-analyser-wave/audio-node-analyser-wave.component';
import { AudioNodeAnalyserBarsComponent } from './components/audio-node-analyser-bars/audio-node-analyser-bars.component';
import { AudioNodeReverbComponent } from './components/audio-node-reverb/audio-node-reverb.component';
import { AudioControlPadComponent } from './components/audio-control-pad/audio-control-pad.component';
import { AudioControlPotComponent } from './components/audio-control-pot/audio-control-pot.component';
import { AudioControlEquComponent } from './components/audio-control-equ/audio-control-equ.component';
import {TruncateFreqPipe} from './pipes/truncate-freq.pipe';
import { AudioNodeGainComponent } from './components/audio-node-gain/audio-node-gain.component';
import { AudioNodeFilterComponent } from './components/audio-node-filter/audio-node-filter.component';
import { AudioNodeDelayComponent } from './components/audio-node-delay/audio-node-delay.component';
import { AudioNodeDistortionComponent } from './components/audio-node-distortion/audio-node-distortion.component';
import { AudioNodeRadioComponent } from './components/audio-node-radio/audio-node-radio.component';
import { RadioHistoryComponent } from './components/radio-history/radio-history.component';

@NgModule({
  declarations: [
    PageMusiqueComponent,
    SearchResultComponent,
    RssFluxComponent,
    ListSavedComponent,
    WatchModalComponent,
    AudioHandlerComponent,
    AudioNodeAnalyserWaveComponent,
    AudioNodeAnalyserBarsComponent,
    AudioNodeReverbComponent,
    AudioControlPadComponent,
    AudioControlPotComponent,
    AudioControlEquComponent,
    TruncateFreqPipe,
    AudioNodeGainComponent,
    AudioNodeFilterComponent,
    AudioNodeDelayComponent,
    AudioNodeDistortionComponent,
    AudioNodeRadioComponent,
    RadioHistoryComponent
  ],
  imports: [
    CommonModule,
    musiqueRoutingModule,
    SharedModule,
    GraphQLModule
  ]
})
export class MusiqueModule { }
