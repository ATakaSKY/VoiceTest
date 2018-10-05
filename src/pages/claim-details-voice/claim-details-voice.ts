import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  AlertController
} from 'ionic-angular';
import moment from 'moment';

import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ClaimSubmissionPage } from '../claim-submission/claim-submission';
import { TextToSpeech } from '@ionic-native/text-to-speech';

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
  isSpeaking: boolean;

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
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private tts: TextToSpeech
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();

    this.apiAIClientService.isSpeaking.subscribe(res => {
      this.isSpeaking = res;
    });
    //this.resultFromIncidentPage = navParams.get('policySelected');
    this.initializeForm();
  }

  sendDate() {
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

                if (whatHappenedResponse.context === 'incident_date_context') {
                  if (whatHappenedResponse.date === undefined) {
                    this.apiAIClientService.speakResponse(
                      "Didn't get the incident date. Please tell me when did the incident happen?"
                    );
                  } else {
                    this.dateofAccident = moment
                      .parseZone(whatHappenedResponse.date)
                      .format('DD-MMM-YY');

                    localStorage.setItem(
                      'LossUpdate',
                      whatHappenedResponse.date
                    );
                    //this.dateofAccident = whatHappenedResponse.date;
                    this.damageAmountText = whatHappenedResponse.speech;
                    this.isdateFilled = true;
                    this.fillDate = false;
                    this.isdateFilledBorder = true;

                    this.apiAIClientService.speakResponse(
                      whatHappenedResponse.speech
                    );
                  }
                } else {
                  this.apiAIClientService.speakResponse(
                    "I didn't get what you said. Please try again."
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
  }

  sendDamageAmount() {
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        //alert(matches[0]);
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

                if (whatHappenedResponse.context === 'damage_amount_context') {
                  if (whatHappenedResponse.damageAmount === undefined) {
                    this.apiAIClientService.speakResponse(
                      "Didn't get the damage amount. Can you tell the damage amount again?"
                    );
                  } else {
                    this.sufferInjuryText = whatHappenedResponse.speech;
                    this.damageAmount = whatHappenedResponse.damageAmount;
                    this.isDamageAmountFilled = true;
                    this.isDamageAmountFilledBorder = true;
                    this.isdateFilled = false;
                    localStorage.setItem(
                      'damageAmount',
                      whatHappenedResponse.damageAmount
                    );
                    localStorage.setItem(
                      'EstimatedAmount',
                      whatHappenedResponse.damageAmount
                    );

                    this.apiAIClientService.speakResponse(
                      whatHappenedResponse.speech
                    );
                  }
                } else {
                  this.apiAIClientService.speakResponse(
                    "I didn't get what you said. Please try again."
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
  }

  sendDidAnyoneSufferInjury() {
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
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
                  whatHappenedResponse.context === 'suffered_injuries_context'
                ) {
                  localStorage.setItem(
                    'howManyInjured',
                    whatHappenedResponse.howMany
                  );
                  if (whatHappenedResponse.howMany === undefined) {
                    this.apiAIClientService.speakResponse(
                      this.sufferInjuryText
                    );
                  } else if (whatHappenedResponse.howMany === 'Zero') {
                    this.howManyInjured = whatHappenedResponse.howMany;

                    this.promptForClaimSubmission(
                      'Your claim has been submitted'
                    );
                  } else {
                    this.nameOfInjuredText = whatHappenedResponse.speech;
                    this.howManyInjured = whatHappenedResponse.howMany;
                    this.isDamageAmountFilled = false;
                    this.didAnyoneSufferInjuriesFilled = true;
                    this.didAnyoneSufferInjuriesFilledBorder = true;

                    this.apiAIClientService.speakResponse(
                      whatHappenedResponse.speech
                    );
                  }
                } else {
                  this.apiAIClientService.speakResponse(
                    "I didn't get what you said. Please try again."
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
  }

  sendNameOfInjured() {
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        let matchName = matches[0];
        //alert(matchName);
        this.apiAIClientService.showLoading();
        this.client.textRequest('Injured Person').then(response => {
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

                if (whatHappenedResponse.context === 'injured_person_context') {
                  this.medicalCostFilledText = `Are the medical costs for ${matchName} less than $2500 or more than $2500?`;
                  //this.nameOfInjured = whatHappenedResponse.nameOfInjured;
                  localStorage.setItem('InjuredPerson', matchName);
                  localStorage.setItem('Description', 'Property Damage');
                  this.nameOfInjured = matchName;
                  this.didAnyoneSufferInjuriesFilled = false;
                  this.isMedicalCostForInjured = true;
                  this.isDamageAmountFilledBorder = true;

                  this.apiAIClientService.speakResponse(
                    `Are the medical costs for ${matchName} less than $2500 or more than $2500?`
                  );
                } else {
                  this.apiAIClientService.speakResponse(
                    "I didn't get what you said. Please try again."
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
  }

  sendMedicalCostForInjured() {
    this.speechRecognition.startListening({ showPopup: false }).subscribe(
      (matches: Array<string>) => {
        //alert(JSON.stringify(matches[0]));
        // alert(matches[0]);
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

                if (whatHappenedResponse.context === 'medical_cost_context') {
                  localStorage.removeItem('EstimatedAmount');
                  localStorage.setItem(
                    'medicalCost',
                    whatHappenedResponse.medicalCost
                  );
                  localStorage.setItem(
                    'EstimatedAmount',
                    whatHappenedResponse.damageAmount
                  );

                  this.medicalCostFilled = whatHappenedResponse.medicalCost;
                  //this.didAnyoneSufferInjuriesFilled = false;
                  this.isMedicalCostForInjured = false;
                  this.promptForClaimSubmission(whatHappenedResponse.speech);
                } else {
                  this.apiAIClientService.speakResponse(
                    "I didn't get what you said. Please try again."
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
  }

  promptForClaimSubmission(submissionSpeech) {
    console.log('claim submitted');

    this.tts
      .speak({
        text: 'Please confirm if you want to submit the claim request',
        locale: 'en-US',
        rate: 1
      })
      .then(res => {
        let confirm = this.alertCtrl.create({
          title: 'Please confirm if you want to submit the claim request',
          enableBackdropDismiss: false,

          buttons: [
            {
              text: 'Confirm',
              handler: data => {
                this.navCtrl.push(ClaimSubmissionPage, {
                  submitSpeech: submissionSpeech
                });
              }
            },
            {
              text: 'Return',
              handler: data => {
                //this.initializeForm();
                //this.resetForm();
                this.navCtrl.popToRoot();
                return true;
              }
            }
          ]
        });

        confirm.present();
      })
      .catch((reason: any) => this.apiAIClientService.displayToast(reason));
  }

  resetForm() {
    this.dateofAccident = '';
    this.damageAmountText = '';
    this.damageAmount = '';
    this.sufferInjuryText = '';
    this.howManyInjured = '';
    this.nameOfInjuredText = '';
    this.nameOfInjured = '';
    this.medicalCostFilledText = '';
    this.medicalCostFilled = '';
  }

  initializeForm() {
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

  processIncident() {
    this.apiAIClientService.speakResponse('When did the incident happen?');
  }
}
