import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
    this.policySelected = navParams.get('policySelected');

    this.initializeAccidentDetailsVoice();
  }

  initializeAccidentDetailsVoice() {
    this.tts
      .speak({
        text: this.policySelected + '. ' + 'Please tell us what happened',
        locale: 'en-IN',
        rate: 1
      })
      .then(() => {
        setTimeout(() => {
          this.whatHappenedRequest();
        }, 1500);
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

  whatHappenedRequest() {
    // Start the recognition process
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        alert(JSON.stringify(matches[0]));

        this.client.textRequest(matches[0]).then(response => {
          // place your result processing here
          console.log(response);
          this.ngZone.run(
            () => {
              let formattedResponse = JSON.parse(
                response.result.fulfillment.speech.speech
              );

              this.tts
                .speak({
                  text: formattedResponse,
                  locale: 'en-IN',
                  rate: 1
                })
                .then(res => {
                  this.showYesNo = true;
                  this.navCtrl.push(ClaimDetailsVoicePage, {
                    res: res,
                    policySelected: this.policySelected
                  });
                })
                .catch((reason: any) => alert(reason));
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
  }
}
