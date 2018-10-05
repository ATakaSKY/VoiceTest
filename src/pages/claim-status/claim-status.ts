import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-claim-status',
  templateUrl: 'claim-status.html'
})
export class ClaimStatusPage {
  lossDate;
  estimatedAmount;
  injuredPerson;
  description;
  howManyInjured;
  damageAmount;
  medicalCost;
  noneInjured: boolean;
  noClaimsData = false;
  hideInjuredDetails = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private clienProviderService: ClientServiceProvider
  ) {
    if (
      localStorage.getItem('LossUpdate') === '' ||
      localStorage.getItem('LossUpdate') === null
    ) {
      this.noClaimsData = true;
    }

    this.lossDate = moment
      .parseZone(localStorage.getItem('LossUpdate'))
      .format('DD-MMM-YY');
    this.lossDate = localStorage.getItem('LossUpdate');
    this.estimatedAmount = localStorage.getItem('EstimatedAmount');
    this.injuredPerson = localStorage.getItem('InjuredPerson');
    this.description = localStorage.getItem('Description');
    this.howManyInjured = localStorage.getItem('howManyInjured');
    this.damageAmount = localStorage.getItem('damageAmount');
    this.medicalCost = localStorage.getItem('medicalCost');

    if (this.injuredPerson === '') {
      this.noneInjured = true;
    }

    if (this.howManyInjured === 'Zero') {
      this.hideInjuredDetails = true;
    }

    this.getDataFromRPA(this.navParams.get('refNumber'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimStatusPage');
  }

  //to be used later for fetching claim details from RPA
  getDataFromRPA(refNumber) {
    this.clienProviderService.showLoading();
    this.clienProviderService
      .getDataFromRPA(refNumber)
      .subscribe((data: any) => {
        this.clienProviderService.stopLoadingSpinner();
        console.log(data);
        if (data.length === 0) {
        } else {
          let fnolData = JSON.parse(data[0].FNOL_DATA_FROM_SOURCE);
          let policyDetails = fnolData.ClaimData.FNOL.PolicyDetails;
          this.lossDate = policyDetails.lossDate;
          this.estimatedAmount = policyDetails.estimatedAmount;
          this.injuredPerson = policyDetails.injuredPerson;
          this.description = policyDetails.description;
        }
      });
  }

  goToHome() {
    this.navCtrl.popToRoot();
  }
}
