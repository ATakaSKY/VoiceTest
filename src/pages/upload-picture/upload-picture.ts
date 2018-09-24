import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientServiceProvider } from '../../providers/client-service/client-service';
import { ClaimDetailsPage } from '../claim-details/claim-details';

@IonicPage()
@Component({
  selector: 'page-upload-picture',
  templateUrl: 'upload-picture.html'
})
export class UploadPicturePage {
  imageOptions: any = ['Yes', 'No'];
  imageSelect = [];
  selectedImageOption: string;
  client: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiAIClientService: ClientServiceProvider,
    private ngZone: NgZone
  ) {
    this.client = apiAIClientService.getAPIAIClientObject();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPicturePage');
  }

  selectedImageEvent(event, option) {
    console.log(event);
    console.log(option);
    this.selectedImageOption = option;
  }

  onImageOk() {
    console.log(this.selectedImageOption);

    //todo - upload image from device
  }

  goToClaimDetails() {
    this.navCtrl.push(ClaimDetailsPage);
  }
}
