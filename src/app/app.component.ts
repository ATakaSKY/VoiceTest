import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Content } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ClientServiceProvider } from '../providers/client-service/client-service';

declare var window;

//import ApiAIPlugin from 'cordova-plugin-apiai';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    apiAIClientService: ClientServiceProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    apiAIClientService.initializeApiAI();
    //   .textRequest('Hello!')
    //   .then(response => {
    //     console.log(JSON.stringify(response));
    //   })
    //   .catch(error => {
    //     alert(error);
    //   });

    // window['ApiAIPlugin'].init(
    //   {
    //     clientAccessToken: '7e3a85e2b4ea4f1d945c4274e3dd5299', // insert your client access key here
    //     lang: 'en' // set lang tag from list of supported languages
    //   },
    //   function(result) {
    //     alert(result);
    //   },
    //   function(error) {
    //     alert(error);
    //   }
    // );
  }
}
