import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageAudioComponent} from './page/page-audio.component';
import {NodeFilterComponent} from './components/node-filter/node-filter.component';
import {NodeEqComponent} from './components/node-eq/node-eq.component';
import {ControlPadComponent} from './components/control-pad/control-pad.component';

import {AudioRoutingModule} from './audio-routing.module';
import {NodeSineWaveComponent} from './components/node-sine-wave/node-sine-wave.component';
import {NodeFreqBarsComponent} from './components/node-freq-bars/node-freq-bars.component';
import {FormsModule} from '@angular/forms';
import {TruncateFreqPipe} from './pipes/truncate-freq.pipe';
import {ControlSlidingComponent} from './components/control-sliding/control-sliding.component';
import {NodeReverbComponent} from './components/node-reverb/node-reverb.component';
import {NodeDistortionComponent} from './components/node-distortion/node-distortion.component';
import {ControlPotComponent} from './components/control-pot/control-pot.component';
import {NodeGainComponent} from './components/node-gain/node-gain.component';
import {NodeOscillatorComponent} from './components/node-oscillator/node-oscillator.component';
import {ControlEnvComponent} from './components/control-env/control-env.component';
import {ControlBpmComponent} from './components/control-bpm/control-bpm.component';
import {NodeSampleComponent} from './components/node-sample/node-sample.component';
import {ControlPartComponent} from './components/control-part/control-part.component';
import { NodeRadioComponent } from './components/node-radio/node-radio.component';
import { ControlSelectComponent } from './components/control-select/control-select.component';
import { ControlMuteComponent } from './components/control-mute/control-mute.component';
import { ControlGammeComponent } from './components/control-gamme/control-gamme.component';
import { PopoverDirective } from './directives/popover.directive';
import { PopoverComponent } from './components/ui-popover/ui-popover.component';
import { UiToggleComponent } from './components/ui-toggle/ui-toggle.component';
import { UiButtonGrpComponent } from './components/ui-button-grp/ui-button-grp.component';
import { NodeDelayComponent } from './components/node-delay/node-delay.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    PageAudioComponent,
    NodeFilterComponent,
    NodeEqComponent,
    ControlPadComponent,
    NodeSineWaveComponent,
    NodeFreqBarsComponent,
    TruncateFreqPipe,
    ControlSlidingComponent,
    NodeReverbComponent,
    NodeDistortionComponent,
    ControlPotComponent,
    NodeGainComponent,
    NodeOscillatorComponent,
    ControlEnvComponent,
    ControlBpmComponent,
    NodeSampleComponent,
    ControlPartComponent,
    NodeRadioComponent,
    ControlSelectComponent,
    ControlMuteComponent,
    ControlGammeComponent,
    PopoverDirective,
    PopoverComponent,
    UiToggleComponent,
    UiButtonGrpComponent,
    NodeDelayComponent
  ],
  imports: [CommonModule, AudioRoutingModule, FormsModule, SharedModule],
  exports: [PageAudioComponent]
})
export class AudioModule {}
