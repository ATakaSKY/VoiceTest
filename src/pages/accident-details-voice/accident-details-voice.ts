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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech,
    public toastCtrl: ToastController
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
    this.policySelected = navParams.get('policySelected');

    this.initializeAccidentDetailsVoice();
  }

  initializeAccidentDetailsVoice() {
    this.selectedPolicyText = `You chose ${
      this.policySelected
    }. Please tell us what happened?`;

    this.tts
      .speak({
        text: this.selectedPolicyText,
        locale: 'en-US',
        rate: 1
      })
      .then(() => {
        //this.whatHappenedRequest();
      })
      .catch((reason: any) => alert(reason));
    // Start the recognition process
    // this.speechRecognition.startListening(this.policySelected).subscribe( --- use policy in future
    // this.speechRecognition.startListening(this.policySelected).subscribe(
    //   (matches: Array<string>) => {
    //     alert(JSON.stringify(matches[0]));

    //     this.client.textRequest('').then(response => {
    //       // place your result processing here
    //       console.log(response);
    //       this.ngZone.run(
    //         () => {
    //           let formattedResponse = JSON.parse(
    //             response.result.fulfillment.speech
    //           );
    //           this.policyText = formattedResponse.text;
    //           this.policyOptions = formattedResponse.policies;

    //           this.tts
    //             .speak({
    //               text: this.policyText,
    //               locale: 'en-IN',
    //               rate: 1
    //             })
    //             .then(() =>
    //               this.navCtrl.push(ReportClaimVoicePage, {
    //                 policyOptions: this.policyOptions
    //               })
    //             )
    //             .catch((reason: any) => alert(reason));
    //         },
    //         onerror => alert(JSON.stringify(onerror))
    //       );

    //       // this.messages.push({
    //       //   text: response.result.fulfillment.speech,
    //       //   sender: 'api'
    //       // });
    //     });
    //     //let dimensions = this.content.getContentDimensions();
    //     //this.content.scrollTo(0, dimensions.scrollHeight + 100, 100);
    //   },
    //   error => {
    //     // place your error processing here
    //     alert(error);
    //   }
    // );

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

  sendVoice() {
    if (this.whatHappenedView) {
      // Start the recognition process
      this.speechRecognition.startListening({ showPopup: false }).subscribe(
        (matches: Array<string>) => {
          //alert(JSON.stringify(matches[0]));

          this.client.textRequest(matches[0]).then(response => {
            // place your result processing here
            console.log(response);
            this.ngZone.run(
              () => {
                if (response.result.fulfillment.speech !== '') {
                  this.tts
                    .speak({
                      text: response.result.fulfillment.speech,
                      locale: 'en-US',
                      rate: 1
                    })
                    .then(() => {
                      //this.func();
                    })
                    .catch((reason: any) => this.displayToast(reason));
                } else {
                  let whatHappenedResponse = response.result.fulfillment.data;

                  //used to toggle what happened and what happened confirm view
                  this.whatHappenedView = false;
                  this.whatHappenedConfirmText = whatHappenedResponse.speech;
                  this.yesNoOptions = whatHappenedResponse.responseText;

                  this.tts
                    .speak({
                      text: whatHappenedResponse.speech,
                      locale: 'en-US',
                      rate: 1
                    })
                    .then(res => {
                      // this.showYesNo = true;
                      // this.navCtrl.push(ClaimDetailsVoicePage, {
                      //   policySelected: this.policySelected
                      // });
                      //this.getWhatHappenedConfirmAndGoToClaimDetails();
                    })
                    .catch((reason: any) => alert(reason));
                }
              },
              onerror => alert(JSON.stringify(onerror))
            );

            // this.messages.push({
            //   text: response.result.fulfillment.speech,
            //   sender: 'api'
            // });
          });
          //let dimensions = this.content.getContentDimensions();
          //this.content.scrollTo(0, dimensions.scrollHeight + 100, 100);
        },
        error => {
          // place your error processing here
          alert(error);
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
          this.whatHappenedView = true;
         // this.displayToast(this.whatHappenedView);
          //this.selectedPolicyText = this.policySelected;
          this.initializeAccidentDetailsVoice();
        } else {
          this.tts
            .speak({
              text: "I didn't get what you said. Please try again.",
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
        this.displayToast(error);
      }
    );
  }
}
