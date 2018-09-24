import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { UploadPicturePage } from '../upload-picture/upload-picture';

@IonicPage()
@Component({
  selector: 'page-accident-details',
  templateUrl: 'accident-details.html'
})
export class AccidentDetailsPage {
  incidentOptions: any = [];
  client: any;
  incidentSelect = [];
  incidentCoverNotes = [];
  coverageFlag: boolean = false;
  selectedIncident: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiAIClientService: ClientServiceProvider,
    private ngZone: NgZone,
    private loadingCtrl: LoadingController
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();

    this.initializeIncidentsList();
  }

  initializeIncidentsList() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.client.textRequest('What Happened?').then(
      response => {
        // place your result processing here
        console.log(response);
        this.ngZone.run(() => {
          loading.dismiss();
          this.incidentOptions = JSON.parse(response.result.fulfillment.speech);
        });
      },
      error => {
        alert(error);
      }
    );
  }

  // initializeIncidentsList() {
  //   this.client.textRequest('5+3').then(
  //     response => {
  //       // place your result processing here
  //       console.log('REsponse from backend');
  //       console.log(response);
  //       this.ngZone.run(() => {
  //         this.incidentOptions = JSON.parse(
  //           response.result.fulfillment.speech
  //         );
  //       });
  //     },
  //     error => {
  //       alert(error);
  //     }
  //   );
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccidentDetailsPage');

    this.incidentOptions = [];
  }

  selectedIncidentEvent(event, incident) {
    this.selectedIncident = incident;
  }

  onIncidentOk() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.client.textRequest(this.selectedIncident).then(
      response => {
        // place your result processing here
        console.log(response);
        //console.log(JSON.parse(response.result.fulfillmentText));

        this.ngZone.run(() => {
          loading.dismiss();
          let incidentNotes = JSON.parse(response.result.fulfillment.speech);
          console.log(incidentNotes);
          if (incidentNotes.responseText.length > 0) {
            this.coverageFlag = true;
            this.incidentCoverNotes = incidentNotes.responseText;
          }
        });
      },
      error => {
        alert(error);
      }
    );
  }

  goToUploadPicture() {
    if (this.incidentCoverNotes.length > 0) {
      this.navCtrl.push(UploadPicturePage);
    }
  }
}
