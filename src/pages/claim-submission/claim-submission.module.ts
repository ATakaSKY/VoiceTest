import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimSubmissionPage } from './claim-submission';

@NgModule({
  declarations: [
    ClaimSubmissionPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimSubmissionPage),
  ],
})
export class ClaimSubmissionPageModule {}
