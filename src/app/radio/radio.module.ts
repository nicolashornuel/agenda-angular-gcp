import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { GraphQLModule } from './graphql.module';
import { AudioHandlerComponent } from './components/audio-handler/audio-handler.component';
import { AudioControlPadComponent } from './components/audio-control-pad/audio-control-pad.component';
import { AudioControlPotComponent } from './components/audio-control-pot/audio-control-pot.component';
import { AudioControlEquComponent } from './components/audio-control-equ/audio-control-equ.component';
import {TruncateFreqPipe} from './pipes/truncate-freq.pipe';
import { AudioNodeDistortionComponent } from './components/audio-node-distortion/audio-node-distortion.component';
import { AudioNodeRadioComponent } from './components/audio-node-radio/audio-node-radio.component';
import { RadioHistoryComponent } from './components/radio-history/radio-history.component';
import { AudioNodeAnalyserComponent } from './components/audio-node-analyser/audio-node-analyser.component';
import { AudioAnalyserBarsDirective } from './directives/audio-analyser-bars.directive';
import { AudioAnalyserWaveDirective } from './directives/audio-analyser-wave.directive';
import { AudioPadDelayDirective } from './directives/audio-pad-delay.directive';
import { AudioPadFilterDirective } from './directives/audio-pad-filter.directive';
import { AudioPadReverbDirective } from './directives/audio-pad-reverb.directive';

const RadioElements = [
  AudioHandlerComponent,
  AudioControlPadComponent,
  AudioControlPotComponent,
  AudioControlEquComponent,
  TruncateFreqPipe,
  AudioNodeDistortionComponent,
  AudioNodeRadioComponent,
  RadioHistoryComponent,
  AudioPadFilterDirective,
  AudioPadReverbDirective,
  AudioPadDelayDirective,
  AudioNodeAnalyserComponent,
  AudioAnalyserBarsDirective,
  AudioAnalyserWaveDirective
]
@NgModule({
  declarations: RadioElements,
  imports: [
    CommonModule,
    SharedModule,
    GraphQLModule
  ],
  exports: RadioElements 
})
export class RadioModule { }
