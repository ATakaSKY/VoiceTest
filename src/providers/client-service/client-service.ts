import { Injectable } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript';

@Injectable()
export class ClientServiceProvider {
  client: any;

  constructor() {
    console.log('Hello ClientServiceProvider Provider');
  }

  initializeApiAI() {
    this.client = new ApiAiClient({
      accessToken: '4692b85b5f7047e397b3193bbbda4209'
    });
  }
  // 7e3a85e2b4ea4f1d945c4274e3dd5299
  getAPIAIClientObject() {
    return this.client;
  }
}
