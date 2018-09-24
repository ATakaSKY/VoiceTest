import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { ClaimSubmissionPage } from '../claim-submission/claim-submission';

@IonicPage()
@Component({
  selector: 'page-claim-details',
  templateUrl: 'claim-details.html'
})
export class ClaimDetailsPage {
  client: any;
  myDate = '09/23/2018';
  yesNoOptions = ['Yes', 'No'];

  hasPropertyDamage: string;
  hasPropertyDamageCost: string;
  hasInjury: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiAIClientService: ClientServiceProvider,
    private ngZone: NgZone
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
  }

  onPropertyDamageChange() {
    console.log(this.hasPropertyDamage);
  }

  onPropertyChargeChange() {}

  onInjuryChange() {}

  submitClaim() {
    console.log('claim submitted');

    this.navCtrl.push(ClaimSubmissionPage);
  }
}
