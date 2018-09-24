import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ReportClaimPage } from '../report-claim/report-claim';
import { ReportClaimVoicePage } from '../report-claim-voice/report-claim-voice';

declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  messages: any[] = [];
  text: string;
  policyOptions = [];
  policyText: string;

  @ViewChild(Content)
  content: Content;
  client: any;

  constructor(
    public navCtrl: NavController,
    // private tts: TextToSpeech,
    private ngZone: NgZone,
    apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();

    this.messages.push({
      text: 'DialogFlow at your service?',
      sender: 'api'
    });
  }

  goToClaimsPage() {
    this.navCtrl.push(ReportClaimPage);
  }

  featureAvailable() {
    // Check feature available
    this.speechRecognition
      .isRecognitionAvailable()
      .then((available: boolean) => {});
  }

  send() {
    let message = this.text;

    this.messages.push({
      text: message,
      sender: 'me'
    });

    let dimensions = this.content.getContentDimensions();
    this.content.scrollTo(0, dimensions.scrollHeight + 100, 100);

    //this.content.scrollToBottom(300);

    this.text = '';

    this.client.textRequest(message).then(
      response => {
        // place your result processing here
        console.log(response);
        this.ngZone.run(() => {
          this.messages.push({
            text: response.result.fulfillment.speech,
            sender: 'api'
          });
        });
        let dimensions = this.content.getContentDimensions();
        this.content.scrollTo(0, dimensions.scrollHeight + 100, 100);
      },
      error => {
        // place your error processing here
        alert(error);
      }
    );
  }

  // sendVoice() {
  //   window['ApiAIPlugin'].requestVoice(
  //     {},
  //     response => {
  //       // alert(JSON.stringify(response));
  //       // place your result processing here
  //       this.tts.speak({
  //         text: response.result.fulfillment.speech,
  //         locale: 'en-IN',
  //         rate: 1
  //       });
  //     },
  //     error => {
  //       // place your error processing here
  //       alert(error);
  //     }
  //   );
  // }

  async feature() {
    // Check feature available
    const speechRecognitionAvailable = await this.speechRecognition.isRecognitionAvailable();

    if (speechRecognitionAvailable) {
      this.getPermission();
    }
  }

  async getPermission() {
    try {
      const permission = await this.speechRecognition.requestPermission();
      //alert(permission);
      if (permission) {
        this.hasPermission();
      }
    } catch (e) {
      alert(e);
    }
  }

  async hasPermission() {
    try {
      const permission = await this.speechRecognition.hasPermission();
      //alert(permission);
      if (permission) {
        this.startListening();
      }
    } catch (e) {
      alert(e);
    }
  }

  startListening() {
    // Start the recognition process
    this.speechRecognition.startListening({}).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));

        this.client.textRequest(matches[0]).then(response => {
          // place your result processing here
          console.log(response);
          this.ngZone.run(
            () => {
              let formattedResponse = JSON.parse(
                response.result.fulfillment.speech
              );
              this.policyText = formattedResponse.text;
              this.policyOptions = formattedResponse.policies;

              this.tts
                .speak({
                  text: this.policyText,
                  locale: 'en-IN',
                  rate: 1
                })
                .then(() =>
                  this.navCtrl.push(ReportClaimVoicePage, {
                    policyOptions: this.policyOptions
                  })
                )
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
