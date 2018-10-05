import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimStatusPage } from './claim-status';

@NgModule({
  declarations: [
    ClaimStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimStatusPage),
  ],
})
export class ClaimStatusPageModule {}
