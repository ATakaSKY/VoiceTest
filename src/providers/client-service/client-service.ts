import { Injectable, NgZone } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { LoadingController, ToastController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { HTTP } from '@ionic-native/http';
import { Subject } from 'rxjs/Subject';

// import {
//   IRequestOptions,
//   IServerResponse,
//   ApiAiConstants
// } from 'api-ai-javascript/es6/ApiAiClien t';
// const lang = ApiAiConstants.AVAILABLE_LANGUAGES.EN_US;

@Injectable()
export class ClientServiceProvider {
  client: any;
  loading;

  isSpeaking = new Subject<boolean>();

  url =
    'http://ec2-18-221-148-14.us-east-2.compute.amazonaws.com:8443/rpafnol/claim';

  constructor(
    private http: HttpClient,
    private _http: HTTP,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private tts: TextToSpeech,
    private ngZone: NgZone
  ) {
    console.log('Hello ClientServiceProvider Provider');
  }

  speakResponse(resposne) {
    this.ngZone.run(() => this.isSpeaking.next(true));
    this.tts
      .speak({
        text: resposne,
        locale: 'en-US',
        rate: 1
      })
      .then(() => {
        this.ngZone.run(() => this.isSpeaking.next(false));
      })
      .catch((reason: any) => this.displayToast(reason));
  }

  displayToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }

  stopLoadingSpinner() {
    this.loading.dismiss();
  }

  sendDataToRPAText() {
    let add5 = {
      ClaimData: {
        FNOL: {
          LossDetails: {
            Description: 'Broken Glass',
            firstnoticesuit: 'No',
            FaultRating: 'Insured at fault',
            Properties: {
              Assessment: {
                Description: 'Broken Glass',
                ToBuilding: 'Yes',
                BuldingComponents: {
                  Estimate: 1000
                }
              }
            },
            LossCause: 'Broken Glass',
            Injuries: {
              InjuredPerson: '',
              Severity: '',
              AmbulanceUsed: 'Yes',
              EstimateAmount: '',
              DetailedInjury: ''
            }
          },
          Newclaim: {
            LossDate: '10/02/2018'
          },
          PolicyDetails: {
            PolicyNumber: '7510725042'
          }
        }
      }
    };

    let RPAPayload = {
      CREATE_USER: 'appuser',
      FNOL_DATA_FROM_SOURCE: JSON.parse(JSON.stringify(JSON.stringify(add5))),
      SOURCE_ID: 'APP',
      SOURCE_TXN_ID: '0005',
      POLICY_NUMBER: '7510725042'
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.url}/add`, RPAPayload, { headers: headers });
  }

  sendDataToRPA() {
    let description = localStorage.getItem('Description')
      ? localStorage.getItem('Description')
      : '';
    let injuredPerson = localStorage.getItem('InjuredPerson')
      ? localStorage.getItem('InjuredPerson')
      : '';
    let LossUpdate = localStorage.getItem('LossUpdate')
      ? localStorage.getItem('LossUpdate')
      : '';
    let estimatedAmount = localStorage.getItem('EstimatedAmount')
      ? localStorage.getItem('EstimatedAmount')
      : '';

    let payload = {
      ClaimData: {
        FNOL: {
          LossDetails: {
            Description: description,
            firstnoticesuit: 'No',
            FaultRating: 'Insured at fault',
            Properties: {
              Assessment: {
                Description: description,
                ToBuilding: 'Yes',
                BuldingComponents: {
                  Estimate: estimatedAmount
                }
              }
            },
            LossCause: description,
            Injuries: {
              InjuredPerson: injuredPerson,
              Severity: '',
              AmbulanceUsed: 'Yes',
              EstimateAmount: estimatedAmount,
              DetailedInjury: ''
            }
          },
          Newclaim: {
            LossDate: LossUpdate
          },
          PolicyDetails: {
            PolicyNumber: '7510725042'
          }
        }
      }
    };

    let RPAPayload = {
      CREATE_USER: 'appuser',
      FNOL_DATA_FROM_SOURCE: JSON.parse(
        JSON.stringify(JSON.stringify(payload))
      ),
      SOURCE_ID: 'APP',
      SOURCE_TXN_ID: '0005',
      POLICY_NUMBER: '7510725042'
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.url}/add`, RPAPayload, { headers: headers });
  }

  getDataFromRPA(refNumber) {
    return this.http.get(`${this.url}/claimByRef/${refNumber}`);
  }

  initializeApiAI() {
    this.client = new ApiAiClient({
      accessToken: 'ea8738baca674d9699a5ce0ee10c050c'
    });
  }
  // 7e3a85e2b4ea4f1d945c4274e3dd5299
  getAPIAIClientObject() {
    return this.client;
  }
}
