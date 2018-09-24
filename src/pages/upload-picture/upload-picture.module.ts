import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadPicturePage } from './upload-picture';

@NgModule({
  declarations: [
    UploadPicturePage,
  ],
  imports: [
    IonicPageModule.forChild(UploadPicturePage),
  ],
})
export class UploadPicturePageModule {}
