import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentDetailsVoicePage } from './accident-details-voice';

@NgModule({
  declarations: [
    AccidentDetailsVoicePage,
  ],
  imports: [
    IonicPageModule.forChild(AccidentDetailsVoicePage),
  ],
})
export class AccidentDetailsVoicePageModule {}
