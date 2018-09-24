import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@IonicPage()
@Component({
  selector: 'page-claim-details-voice',
  templateUrl: 'claim-details-voice.html'
})
export class ClaimDetailsVoicePage {
  resultFromIncidentPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    apiAIClientService: ClientServiceProvider,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeech
  ) {
    this.resultFromIncidentPage = navParams.get('res');

    if (this.resultFromIncidentPage) {
      alert('This was our journey. See you soon!!');
    } else {
      this.processIncident();
      //TODO - if users selects no
      // this.navCtrl.pop({
      //   policySelected:navParams.get('policySelected')
      // })
    }
  }

  processIncident() {
    this.tts
      .speak({
        text: 'When did the incident happen?',
        locale: 'en-IN',
        rate: 1
      })
      .then(res => {
        setTimeout(() => {
          //this.incidentWhereAbout();
          alert('This was our journey. See you soon!!');
        }, 1500);
      })
      .catch((reason: any) => alert(reason));
  }

  // incidentWhereAbout(){
  //   this.speechRecognition.startListening({}).subscribe(
  //     (matches: Array<string>) => {
  //       alert(JSON.stringify(matches[0]));

  //       this.client.textRequest(matches[0]).then(response => {
  //         // place your result processing here
  //         console.log(response);
  //         this.ngZone.run(
  //           () => {
  //             let formattedResponse = JSON.parse(
  //               response.result.fulfillment.speech.speech
  //             );

  //             this.tts
  //               .speak({
  //                 text: formattedResponse,
  //                 locale: 'en-IN',
  //                 rate: 1
  //               })
  //               .then(res => {
  //                 this.showYesNo = true;
  //                 this.navCtrl.push(ClaimDetailsVoicePage, {
  //                   res: res,
  //                   policySelected: this.policySelected
  //                 });
  //               })
  //               .catch((reason: any) => alert(reason));
  //           },
  //           onerror => alert(JSON.stringify(onerror))
  //         );

  //         // this.messages.push({
  //         //   text: response.result.fulfillment.speech,
  //         //   sender: 'api'
  //         // });
  //       });
  //       //let dimensions = this.content.getContentDimensions();
  //       //this.content.scrollTo(0, dimensions.scrollHeight + 100, 100);
  //     },
  //     error => {
  //       // place your error processing here
  //       alert(error);
  //     }
  //   );
  // }
}
