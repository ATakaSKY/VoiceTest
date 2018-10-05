import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AccidentDetailsVoicePage } from '../accident-details-voice/accident-details-voice';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Subscription } from 'rxjs/Subscription';

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
  isSpeaking: boolean;

  isSpeakingSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private ngZone: NgZone,
    private tts: TextToSpeech,
    public toastCtrl: ToastController
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
    this.policyResponse = navParams.get('policyResponse');

    this.isSpeakingSubscription = this.apiAIClientService.isSpeaking.subscribe(
      res => {
        this.isSpeaking = res;
      }
    );
    this.hearPolicy();
  }

  ionViewDidLoad() {}

  async hearPolicy() {
    this.policyText = this.policyResponse.text;
    this.policyOptions = this.policyResponse.policies;

    // this.isSpeaking = true;

    this.apiAIClientService.speakResponse(this.policyText);

    // this.tts
    //   .speak({
    //     text: this.policyText,
    //     locale: 'en-US',
    //     rate: 1
    //   })
    //   .then(() => {
    //     this.isSpeaking = false;
    //   })
    //   .catch((reason: any) => this.apiAIClientService.displayToast(reason));
  }

  async sendVoice() {
    // Start the recognition process
    const speechrecog = await this.speechRecognition.startListening({
      showPopup: false
    });

    speechrecog.subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        // alert(matches[0]);
        let findPolicyIfExist = this.policyOptions.find(
          option => option.toLowerCase() == matches[0].toLowerCase()
        );

        // alert(findPolicyIfExist);

        if (findPolicyIfExist) {
          localStorage.setItem('LossCause', findPolicyIfExist);
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
            .catch((reason: any) =>
              this.apiAIClientService.displayToast(reason)
            );
        }
      },
      error => {
        // place your error processing here
        this.apiAIClientService.displayToast(error);
      }
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.isSpeakingSubscription.unsubscribe();
  }
}
