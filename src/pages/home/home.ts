import { Component, NgZone, ViewChild } from '@angular/core';
import {
  NavController,
  Content,
  LoadingController,
  ToastController
} from 'ionic-angular';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();

    setTimeout(() => this.getWelcomeIntent(), 1500);
    // this.messages.push({
    //   text: 'DialogFlow at your service?',
    //   sender: 'api'
    // });
  }

  getWelcomeIntent() {
    this.tts
      .speak({
        text:
          "Welcome to the test version of Talking Helper.Hello John! Welcome to Deloitte's Talking Insurance. How can I help you today?",
        locale: 'en-US',
        rate: 1
      })
      .then(() => {
        this.welcomeIntentFinished = true;
      });
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.imageURI = imageData;
      },
      err => {
        console.log(err);
        this.presentToast(err);
      }
    );
  }

  presentToast(msg) {
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

  // callTest() {
  //   this.apiAIClientService.getTestData().subscribe(data => {
  //     console.log(data);
  //   });
  // }

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
        alert(JSON.stringify(matches[0]));

        this.hearPolicy(matches[0]);
      },
      error => {
        // place your error processing here
        alert(error);
      }
    );
  }

  async hearPolicy(match) {
    this.client.textRequest(match).then(response => {
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
                alert(123);
              })
              .catch((reason: any) => this.displayToast(reason));
          } else {
            let formattedResponse = response.result.fulfillment.data;

            this.navCtrl.push(ReportClaimVoicePage, {
              policyResponse: formattedResponse
            });
          }
        },
        onerror => {
          this.displayToast(onerror);
        }
      );
    });
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
}
