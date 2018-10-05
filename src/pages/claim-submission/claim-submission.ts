import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { ClaimStatusPage } from '../claim-status/claim-status';
import { TextToSpeech } from '@ionic-native/text-to-speech';

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
  refNumber;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private clientServiceProvider: ClientServiceProvider,
    private tts: TextToSpeech
  ) {
    this.saveToRPA();
    //this.refNumber = Math.ceil(Math.random() * 100000000) + 900000000;
  }

  goToHome() {
    this.navCtrl.popToRoot();
  }

  saveToRPA() {
    this.clientServiceProvider.showLoading();
    this.clientServiceProvider.sendDataToRPA().subscribe(
      res => {
        this.clientServiceProvider.stopLoadingSpinner();
        //alert(`success ${res}`);
        this.refNumber = res;
        this.clientServiceProvider.speakResponse(
          this.navParams.get('submitSpeech')
        );
        localStorage.setItem('refNumber', this.refNumber);
        // console.log(res.status);
        // console.log(res.data); // res received by server
        // console.log(res.headers);
      },
      err => {
        alert(`error ${err}`);
        this.clientServiceProvider.displayToast(err);
        // console.log(err.status);
        // console.log(err.error); // err received by server
        // console.log(err.headers);
      }
    );
  }

  goToClaimStatus() {
    this.navCtrl.push(ClaimStatusPage, { refNumber: this.refNumber });
  }
}
