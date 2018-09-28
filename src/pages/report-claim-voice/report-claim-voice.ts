import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AccidentDetailsVoicePage } from '../accident-details-voice/accident-details-voice';
import { TextToSpeech } from '@ionic-native/text-to-speech';

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
  client: any;
  policyResponse: any;
  policyOptions = [];
  policyText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private ngZone: NgZone,
    private tts: TextToSpeech,
    public toastCtrl: ToastController,
    private storage: Storage
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
    this.policyResponse = navParams.get('policyResponse');

    this.hearPolicy();
  }

  ionViewDidLoad() {}

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

  async hearPolicy() {
    this.policyText = this.policyResponse.text;
    this.policyOptions = this.policyResponse.policies;

    this.tts
      .speak({
        text: this.policyText,
        locale: 'en-US',
        rate: 1
      })
      .then(() => {
        //this.func();
      })
      .catch((reason: any) => this.displayToast(reason));
  }

  async sendVoice() {
    // Start the recognition process
    const speechrecog = await this.speechRecognition.startListening({
      showPopup: false
    });

    speechrecog.subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        alert(matches[0]);
        let findPolicyIfExist = this.policyOptions.find(
          option => option.toLowerCase() == matches[0].toLowerCase()
        );

        alert(findPolicyIfExist);

        if (findPolicyIfExist) {
          this.storage.set('LossCause', findPolicyIfExist);
          this.navCtrl.push(AccidentDetailsVoicePage, {
            policySelected: matches[0]
          });
        } else {
          this.tts
            .speak({
              text:
                "We couldn't locate a policy with that name. Please choose from the options available.",
              locale: 'en-US',
              rate: 1
            })
            .then(() => {
              //this.func();
            })
            .catch((reason: any) => this.displayToast(reason));
        }
      },
      error => {
        // place your error processing here
        alert(error);
      }
    );
  }
}
