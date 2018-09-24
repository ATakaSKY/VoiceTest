import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

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

@NgModule({
  declarations: [MyApp, HomePage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AccidentDetailsPageModule,
    UploadPicturePageModule,
    ReportClaimPageModule,
    ClaimDetailsPageModule,
    ClaimSubmissionPageModule,
    ReportClaimVoicePageModule,
    AccidentDetailsVoicePageModule,
    ClaimDetailsVoicePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ClientServiceProvider,
    SpeechRecognition,
    TextToSpeech
  ]
})
export class AppModule {}
