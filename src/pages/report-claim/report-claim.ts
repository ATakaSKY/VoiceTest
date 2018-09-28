import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { AccidentDetailsPage } from '../accident-details/accident-details';
import { TextToSpeech } from '@ionic-native/text-to-speech';

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
    private loadingCtrl: LoadingController,
    private tts: TextToSpeech,
    public toastCtrl: ToastController
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

          if (response.result.fulfillment.speech !== '') {
            console.log(response.result.fulfillment.speech);
            //TEXT VERSION WONT HAVE A TYUPING MISTAKE
            // this.tts
            //   .speak({
            //     text: response,
            //     locale: 'en-US',
            //     rate: 1
            //   })
            //   .then(() => {
            //     //this.func();
            //   })
            //   .catch((reason: any) => this.displayToast(reason));
          } else {
            let formattedResponse = response.result.fulfillment.data;

            this.policyText = formattedResponse.text;
            this.policyOptions = formattedResponse.policies;
          }
        });
      },
      error => {
        this.displayToast(error);
      }
    );
  }

  displayToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportClaimPage');
  }

  goToWhatHappened() {
    this.navCtrl.push(AccidentDetailsPage);
  }
}
