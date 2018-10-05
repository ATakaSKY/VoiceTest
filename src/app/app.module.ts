import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { HttpClientModule } from '@angular/common/http';
// import {
//   FileTransfer,
//   FileUploadOptions,
//   FileTransferObject
// } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
// import { Camera } from '@ionic-native/camera';
// import { IonicStorageModule } from '@ionic/storage';
// import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ClientServiceProvider } from '../providers/client-service/client-service';
import { AccidentDetailsPageModule } from '../pages/accident-details/accident-details.module';
import { UploadPicturePageModule } from '../pages/upload-picture/upload-picture.module';
import { ReportClaimPageModule } from '../pages/report-claim/report-claim.module';
import { ClaimDetailsPageModule } from '../pages/claim-details/claim-details.module';
import { ClaimSubmissionPageModule } from '../pages/claim-submission/claim-submission.module';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { ReportClaimVoicePageModule } from '../pages/report-claim-voice/report-claim-voice.module';
import { AccidentDetailsVoicePageModule } from '../pages/accident-details-voice/accident-details-voice.module';
import { ClaimDetailsVoicePageModule } from '../pages/claim-details-voice/claim-details-voice.module';
import { ClaimStatusPageModule } from '../pages/claim-status/claim-status.module';

@NgModule({
  declarations: [MyApp, HomePage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //IonicStorageModule.forRoot(),
    AccidentDetailsPageModule,
    UploadPicturePageModule,
    ReportClaimPageModule,
    ClaimDetailsPageModule,
    ClaimSubmissionPageModule,
    ReportClaimVoicePageModule,
    AccidentDetailsVoicePageModule,
    ClaimDetailsVoicePageModule,
    HttpClientModule,
    ClaimStatusPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ClientServiceProvider,
    SpeechRecognition,
    TextToSpeech,
    // FileTransfer,
    // //FileUploadOptions,
    // FileTransferObject,
    File,
    // Camera,
    // Geolocation,
    HTTP
  ]
})
export class AppModule {}
