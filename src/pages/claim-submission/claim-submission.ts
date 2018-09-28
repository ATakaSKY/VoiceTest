import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';

/**
 * Generated class for the ClaimSubmissionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim-submission',
  templateUrl: 'claim-submission.html'
})
export class ClaimSubmissionPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private clientServiceProvider: ClientServiceProvider
  ) {
    this.saveToRPA();
  }

  saveToRPA() {
    this.clientServiceProvider.sendDataToRPA();
  }
}
