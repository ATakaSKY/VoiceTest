import { Component, NgZone, ViewChild } from '@angular/core';
import {
  NavController,
  Content,
  LoadingController,
  ToastController
} from 'ionic-angular';

import { TextToSpeech } from '@ionic-native/text-to-speech';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ReportClaimPage } from '../report-claim/report-claim';
import { ReportClaimVoicePage } from '../report-claim-voice/report-claim-voice';
import { ClaimStatusPage } from '../claim-status/claim-status';

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

  imageURI: any;
  imageFileName: any;

  @ViewChild(Content)
  content: Content;
  client: any;
  welcomeIntentFinished: boolean = false;

  selectedSection; //dont use later

  constructor(
    public navCtrl: NavController,
    // private tts: TextToSpeech,
    private ngZone: NgZone,
    private apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech,
    // private transfer: FileTransfer,
    // private camera: Camera,
    public loadingCtrl: LoadingController // private storage: Storage
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
  }

  claimStatus() {
    this.navCtrl.push(ClaimStatusPage);
  }

  getWelcomeIntent() {
    this.tts
      .speak({
        text: 'Hello John. Welcome to talk insure. How can I help you today.',
        locale: 'en-US',
        rate: 1
      })
      .then(() => {
        this.welcomeIntentFinished = true;
      });
  }

  // getImage() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  //   };

  //   this.camera.getPicture(options).then(
  //     imageData => {
  //       this.imageURI = imageData;
  //     },
  //     err => {
  //       console.log(err);
  //       this.apiAIClientService.displayToast(err);
  //     }
  //   );
  // }

  goToClaimsPage() {
    this.navCtrl.push(ReportClaimPage);
  }

  ionViewDidLoad() {
    setTimeout(() => this.getWelcomeIntent(), 500);
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
        this.apiAIClientService.displayToast(error);
      }
    );
  }

  async voiceClaim() {
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
      this.apiAIClientService.displayToast(e);
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
      this.apiAIClientService.displayToast(e);
    }
  }

  startListening() {
    // Start the recognition process
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        // alert(matches[0]);

        this.hearPolicy(matches[0]);
      },
      error => {
        // place your error processing here
        this.apiAIClientService.displayToast(error);
      }
    );
  }

  async hearPolicy(match) {
    this.apiAIClientService.showLoading();

    this.client.textRequest(match).then(response => {
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
            let formattedResponse = response.result.fulfillment.data;

            if (formattedResponse.context === 'report_claim_context') {
              this.navCtrl.push(ReportClaimVoicePage, {
                policyResponse: formattedResponse
              });
            } else {
              this.apiAIClientService.speakResponse(
                "I didn't get that. Can you say that again."
              );
            }
          }
        },
        onerror => {
          this.apiAIClientService.displayToast(onerror);
        }
      );
    });
  }
}
