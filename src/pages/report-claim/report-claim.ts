import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { AccidentDetailsPage } from '../accident-details/accident-details';

@IonicPage()
@Component({
  selector: 'page-report-claim',
  templateUrl: 'report-claim.html'
})
export class ReportClaimPage {
  client: any;
  policyOptions = [];
  policyText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    private apiAIClientService: ClientServiceProvider,
    private loadingCtrl: LoadingController
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
    this.initializeClaimsPage();
  }

  initializeClaimsPage() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.client.textRequest('make claim').then(
      response => {
        // place your result processing here
        console.log('REsponse from backend');
        console.log(response);
        this.ngZone.run(() => {
          loading.dismiss();
          let formattedResponse = JSON.parse(
            response.result.fulfillment.speech
          );
          this.policyText = formattedResponse.text;
          this.policyOptions = formattedResponse.policies;
        });
      },
      error => {
        alert(error);
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportClaimPage');
  }

  goToWhatHappened() {
    this.navCtrl.push(AccidentDetailsPage);
  }
}
