import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Helpers } from '../../../Helpers/helpers';
import { Router } from '@angular/router';
import { AlertsProviderService } from '../../../Providers/alerts-provider.service'; 
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
@Component({
  selector: 'app-additional-content',
  templateUrl: './additional-content.page.html',
  styleUrls: ['./additional-content.page.scss'],
})
export class AdditionalContentPage implements OnInit {
  additionalGoods:any;
  scenePhotos: string[];
  constructor(    public alertController: AlertController,
    private helpers: Helpers,
    private camera: Camera,
    private route: Router,
    private customeAlert: AlertsProviderService) {
      this.additionalGoods =  Array(3).fill(0, 0, 5);
      this.scenePhotos = [];
     }

  ngOnInit() {
  }

  capturePhoto(index: number) {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.scenePhotos[index] = "data:image/jpeg;base64," + imageData;
      },
      err => {
        this.customeAlert.presentAlert("Image Error", "Couldn't load image, please try again")
        // Handle error
      }
    );
  }

  async presentAlertConfirm(index: number) {
    const myalert = await this.alertController.create({
      header: "Choose Image Source",
      message: "",
      buttons: [
        {
          text: "Photo Library",
          cssClass: "secondary",
          handler: blah => {
            console.log("blak");
            this.capturePhoto(index);
          }
        },
        {
          text: "Camera",
          handler: () => { }
        }
      ]
    });
    await myalert.present();
  }

  nextPage(){
    this.route.navigate(["vehicle-checklist"]);
  }

  goBack(){
   
    this.route.navigateByUrl("scene-photos");
  }

}
