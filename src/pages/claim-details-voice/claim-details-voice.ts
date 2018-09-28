import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import moment from 'moment';

import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { ClaimSubmissionPage } from '../claim-submission/claim-submission';

@IonicPage()
@Component({
  selector: 'page-claim-details-voice',
  templateUrl: 'claim-details-voice.html'
})
export class ClaimDetailsVoicePage {
  resultFromIncidentPage;
  fillDate: boolean;
  isdateFilled: boolean;
  isDamageAmountFilled: boolean;
  didAnyoneSufferInjuriesFilled: boolean;
  nameOfInjuredPersonFilled: boolean;
  doYouThinkMedicalCostFilled: boolean;
  isMedicalCostForInjured: boolean;
  client;

  //received data
  dateofAccident;
  damageAmount;
  howManyInjured;
  nameOfInjured;
  medicalCostFilled;

  //
  damageAmountText;
  sufferInjuryText;
  nameOfInjuredText;
  medicalCostFilledText;

  //for border styling
  isdateFilledBorder: boolean;
  isDamageAmountFilledBorder: boolean;
  didAnyoneSufferInjuriesFilledBorder: boolean;
  isMedicalCostForInjuredBorder: boolean;

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
    //this.resultFromIncidentPage = navParams.get('policySelected');
    this.processIncident();
    this.fillDate = true;
    this.isDamageAmountFilled = false;
    this.didAnyoneSufferInjuriesFilled = false;
    this.nameOfInjuredPersonFilled = false;
    this.doYouThinkMedicalCostFilled = false;

    this.isdateFilledBorder = false;
    this.isDamageAmountFilledBorder = false;
    this.didAnyoneSufferInjuriesFilledBorder = false;
    this.isMedicalCostForInjuredBorder = false;
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

  sendDate() {
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
                //this.displayToast(whatHappenedResponse);
                alert(123);
                alert(whatHappenedResponse.speech);
                alert(whatHappenedResponse.date);
                //used to toggle what happened and what happened confirm view

                if (whatHappenedResponse.date === undefined) {
                  this.tts
                    .speak({
                      text:
                        "Didn't get the incident date. Please tell me when did the incident happen?",
                      locale: 'en-US',
                      rate: 1
                    })
                    .then(() => {
                      //this.func();
                    })
                    .catch((reason: any) => this.displayToast(reason));
                } else {
                  this.dateofAccident = moment
                    .parseZone(whatHappenedResponse.date)
                    .format('DD-MMM-YY');

                  localStorage.setItem('LossUpdate', whatHappenedResponse.date);
                  //this.dateofAccident = whatHappenedResponse.date;
                  this.damageAmountText = whatHappenedResponse.speech;
                  this.isdateFilled = true;
                  this.fillDate = false;
                  this.isdateFilledBorder = true;

                  //whatHappenedResponse.date; // save this in localForage later

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
  }

  sendDamageAmount() {
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        alert(matches[0]);
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
                //this.displayToast(whatHappenedResponse);
                alert(123);
                alert(whatHappenedResponse.speech);
                alert(whatHappenedResponse.damageAmount);
                //used to toggle what happened and what happened confirm view

                if (whatHappenedResponse.damageAmount === undefined) {
                  this.tts
                    .speak({
                      text:
                        "Didn't get the damage amount. Can you tell the damage amount again?",
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
                } else {
                  this.sufferInjuryText = whatHappenedResponse.speech;
                  this.damageAmount = whatHappenedResponse.damageAmount;
                  this.isDamageAmountFilled = true;
                  this.isDamageAmountFilledBorder = true;
                  this.isdateFilled = false;
                  localStorage.setItem(
                    'EstimatedAmount',
                    whatHappenedResponse.damageAmount
                  );

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
  }

  sendDidAnyoneSufferInjury() {
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        alert(matches[0]);
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
                //this.displayToast(whatHappenedResponse);
                alert(123);
                alert(whatHappenedResponse.speech);
                alert(whatHappenedResponse.howMany);
                //used to toggle what happened and what happened confirm view

                if (whatHappenedResponse.howMany === undefined) {
                  this.tts
                    .speak({
                      text: this.sufferInjuryText,
                      locale: 'en-US',
                      rate: 1
                    })
                    .then(() => {
                      //this.func();
                    })
                    .catch((reason: any) => this.displayToast(reason));
                } else if (whatHappenedResponse.howMany === 'None') {
                  this.navCtrl.push(ClaimSubmissionPage);
                } else {
                  this.nameOfInjuredText = whatHappenedResponse.speech;
                  this.howManyInjured = whatHappenedResponse.howMany;
                  this.isDamageAmountFilled = false;
                  this.didAnyoneSufferInjuriesFilled = true;
                  this.didAnyoneSufferInjuriesFilledBorder = true;

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
  }

  sendNameOfInjured() {
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        let matchName = matches[0];
        alert(matchName);
        this.client.textRequest('Injured Person').then(response => {
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
                //this.displayToast(whatHappenedResponse);
                alert(123);
                alert(whatHappenedResponse.speech);
                alert(whatHappenedResponse.nameOfInjured);
                //used to toggle what happened and what happened confirm view

                // if (whatHappenedResponse.nameOfInjured === undefined) {
                //   this.tts
                //     .speak({
                //       text: `Didn't get the name of injured person. Can you say that again`,
                //       locale: 'en-US',
                //       rate: 1
                //     })
                //     .then(res => {
                //       // this.showYesNo = true;
                //       // this.navCtrl.push(ClaimDetailsVoicePage, {
                //       //   policySelected: this.policySelected
                //       // });
                //       //this.getWhatHappenedConfirmAndGoToClaimDetails();
                //     })
                //     .catch((reason: any) => alert(reason));
                // }

                this.medicalCostFilledText = `Are the medical costs for ${matchName} less than $2500 or more than $2500?`;
                //this.nameOfInjured = whatHappenedResponse.nameOfInjured;
                localStorage.setItem(
                  'InjuredPerson',
                  whatHappenedResponse.date
                );
                localStorage.setItem('Description', 'Property Damage');
                this.nameOfInjured = matchName;
                this.didAnyoneSufferInjuriesFilled = false;
                this.isMedicalCostForInjured = true;
                this.isDamageAmountFilledBorder = true;

                this.tts
                  .speak({
                    text: `Are the medical costs for ${matchName} less than $2500 or more than $2500?`,
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
  }

  sendMedicalCostForInjured() {
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        alert(matches[0]);
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
                //this.displayToast(whatHappenedResponse);
                alert(123);
                alert(whatHappenedResponse.speech);
                alert(whatHappenedResponse.medicalCost);
                localStorage.removeItem('EstimatedAmount');
                localStorage.setItem(
                  'EstimatedAmount',
                  whatHappenedResponse.damageAmount
                );
                alert(JSON.stringify(localStorage.getItem('LossCause')));
                alert(JSON.stringify(localStorage.getItem('LossUpdate')));
                alert(JSON.stringify(localStorage.getItem('InjuredPerson')));
                alert(JSON.stringify(localStorage.getItem('Description')));
                alert(JSON.stringify(localStorage.getItem('EstimatedAmount')));
                //used to toggle what happened and what happened confirm view

                //medicalCost --- use in localForage

                //this.medicalCostFilledText = whatHappenedResponse.speech;

                // if (whatHappenedResponse.nameOfInjured === undefined) {
                //   this.tts
                //     .speak({
                //       text: `Didn't get the medical cost. Can you say that again`,
                //       locale: 'en-US',
                //       rate: 1
                //     })
                //     .then(res => {
                //       // this.showYesNo = true;
                //       // this.navCtrl.push(ClaimDetailsVoicePage, {
                //       //   policySelected: this.policySelected
                //       // });
                //       //this.getWhatHappenedConfirmAndGoToClaimDetails();
                //     })
                //     .catch((reason: any) => alert(reason));
                // } else {
                this.medicalCostFilled = whatHappenedResponse.medicalCost;
                //this.didAnyoneSufferInjuriesFilled = false;
                this.isMedicalCostForInjured = false;

                this.tts
                  .speak({
                    text: whatHappenedResponse.speech,
                    locale: 'en-US',
                    rate: 1
                  })
                  .then(res => {
                    this.navCtrl.push(ClaimSubmissionPage);
                    // this.showYesNo = true;
                    // this.navCtrl.push(ClaimDetailsVoicePage, {
                    //   policySelected: this.policySelected
                    // });
                    //this.getWhatHappenedConfirmAndGoToClaimDetails();
                  })
                  .catch((reason: any) => alert(reason));
                //}
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
  }

  processIncident() {
    this.tts
      .speak({
        text: 'When did the incident happen?',
        locale: 'en-US',
        rate: 1
      })
      .then(res => {})
      .catch((reason: any) => alert(reason));
  }

  submitClaim() {}

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
