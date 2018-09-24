import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AccidentDetailsVoicePage } from '../accident-details-voice/accident-details-voice';

/**
 * Generated class for the ReportClaimVoicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-claim-voice',
  templateUrl: 'report-claim-voice.html'
})
export class ReportClaimVoicePage {
  policyOptions = [];
  client: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private ngZone: NgZone
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
    this.policyOptions = navParams.get('policyOptions');

    this.hearPolicy();
  }

  ionViewDidLoad() {}

  async hearPolicy() {
    // Start the recognition process
    const speechrecog = await this.speechRecognition.startListening({
      showPopup: false
    });
    setTimeout(() => {
      speechrecog.subscribe(
        (matches: Array<string>) => {
          //alert(JSON.stringify(matches[0]));

          this.navCtrl.push(AccidentDetailsVoicePage, {
            policySelected: matches[0]
          });
        },
        error => {
          // place your error processing here
          alert(error);
        }
      );
    }, 1000);

    //     this.tts
    //       .speak({
    //         text: matches[0],
    //         locale: 'en-IN',
    //         rate: 1
    //       })
    //       .then(() => alert('Success'))
    //       .catch((reason: any) => alert(reason));
    //   },
    //   onerror => alert(JSON.stringify(onerror))
    // );
  }
}
