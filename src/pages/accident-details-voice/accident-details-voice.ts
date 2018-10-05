import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { ClaimDetailsVoicePage } from '../claim-details-voice/claim-details-voice';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the AccidentDetailsVoicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accident-details-voice',
  templateUrl: 'accident-details-voice.html'
})
export class AccidentDetailsVoicePage {
  client;
  policySelected;
  showYesNo: boolean = false;
  selectedPolicyText: string;
  whatHappenedConfirmText: string;
  yesNoOptions = [];

  whatHappenedView: boolean = true; //initially it will be what happened view
  isSpeaking: boolean; //mic enable/disable

  isSpeakingSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    private apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech,
    public toastCtrl: ToastController
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
    this.policySelected = navParams.get('policySelected');

    this.isSpeakingSubscription = this.apiAIClientService.isSpeaking.subscribe(
      res => {
        this.isSpeaking = res;
      }
    );

    this.initializeAccidentDetailsVoice();
  }

  initializeAccidentDetailsVoice() {
    this.selectedPolicyText = `You chose ${
      this.policySelected
    }. Please tell us what happened?`;

    //this.isSpeaking = true;
    this.apiAIClientService.speakResponse(this.selectedPolicyText);
    // this.tts
    //   .speak({
    //     text: this.selectedPolicyText,
    //     locale: 'en-US',
    //     rate: 1
    //   })
    //   .then(() => {
    //     //this.isSpeaking = false;
    //   })
    //   .catch((reason: any) => this.apiAIClientService.displayToast(reason));
  }

  sendVoice() {
    if (this.whatHappenedView) {
      // Start the recognition process
      this.speechRecognition.startListening({ showPopup: false }).subscribe(
        (matches: Array<string>) => {
          //alert(JSON.stringify(matches[0]));
          this.apiAIClientService.showLoading();
          this.client.textRequest(matches[0]).then(response => {
            // place your result processing here
            console.log(response);
            this.ngZone.run(
              () => {
                this.apiAIClientService.stopLoadingSpinner();
                if (response.result.fulfillment.speech !== '') {
                  this.apiAIClientService.speakResponse(
                    response.result.fulfillment.speech
                  );
                } else {
                  let whatHappenedResponse = response.result.fulfillment.data;

                  if (
                    whatHappenedResponse.context === 'incident_selected_context'
                  ) {
                    //used to toggle what happened and what happened confirm view
                    this.whatHappenedView = false;
                    this.whatHappenedConfirmText = whatHappenedResponse.speech;
                    this.yesNoOptions = whatHappenedResponse.responseText;

                    this.apiAIClientService.speakResponse(
                      whatHappenedResponse.speech
                    );
                  } else {
                    this.apiAIClientService.speakResponse(
                      "I didn't get that. Can you say that again."
                    );
                  }
                }
              },
              onerror => this.apiAIClientService.displayToast(onerror)
            );
          });
        },
        error => {
          // place your error processing here
          this.apiAIClientService.displayToast(error);
        }
      );
    } else {
    }
  }

  getWhatHappenedConfirmAndGoToClaimDetails() {
    // Start the recognition process
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));

        if (matches[0].toLowerCase() === 'yes') {
          this.navCtrl.push(ClaimDetailsVoicePage);
        } else if (matches[0].toLowerCase() === 'no') {
          this.ngZone.run(() => {
            this.whatHappenedView = true;
          });
          this.initializeAccidentDetailsVoice();
        } else {
          this.apiAIClientService.speakResponse(
            "I didn't get what you said. Please try again."
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
