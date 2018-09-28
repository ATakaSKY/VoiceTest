import { Injectable } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClientServiceProvider {
  client: any;

  constructor(private http: HttpClient) {
    console.log('Hello ClientServiceProvider Provider');
  }

  getTestData() {
    return this.http.get(
      'https://us-central1-voiceinsu.cloudfunctions.net/dialogflowFirebaseFulfillment'
    );
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

    let RPAPayload = JSON.stringify({
      CREATE_USER: 'appuser',
      FNOL_DATA_FROM_SOURCE: {
        ClaimData: {
          FNOL: {
            PolicyDetails: {
              ambulanceUsed: 'Yes',
              anyDamageProp: '1',
              bodilyInj: '1',
              damageDescription: 'Damage done',
              describeInjuries: 'Head injury',
              description: localStorage.getItem('Description'),
              estimatedAmount: localStorage.getItem('EstimatedAmount'),
              faultRating: 'Other party at fault',
              injuredPerson: localStorage.getItem('InjuredPerson'),
              litigation: 'Yes',
              lossDate: localStorage.getItem('LossUpdate'),
              losscause: 'Business Owners',
              lostEstimate: '123456',
              policyNumber: '12345678',
              severity: 'Minor',
              tobuilding: 'Yes'
            }
          }
        }
      },
      SOURCE_ID: 'APP',
      SOURCE_TXN_ID: '0005'
    });
    return this.http
      .post(
        'http://ec2-18-221-148-14.us-east-2.compute.amazonaws.com:8443/rpafnol/claim/add',
        RPAPayload
      )
      .subscribe(
        res => {
          alert(`success ${res}`);
        },
        err => {
          alert(`success ${err}`);
        }
      );
  }

  initializeApiAI() {
    this.client = new ApiAiClient({
      accessToken: 'a7c7d83df52a46718c53420a0ab6636f'
    });
  }
  // 7e3a85e2b4ea4f1d945c4274e3dd5299
  getAPIAIClientObject() {
    return this.client;
  }
}
