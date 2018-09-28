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
