import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimDetailsPage } from './claim-details';

@NgModule({
  declarations: [
    ClaimDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimDetailsPage),
  ],
})
export class ClaimDetailsPageModule {}
