import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';
import { Helpers } from '../../../helpers/helpers';
import { AlertsProviderService } from '../../../providers/alerts-provider.service';
@Component({
  selector: 'app-scene-photos',
  templateUrl: './scene-photos.page.html',
  styleUrls: ['./scene-photos.page.scss'],
})
export class ScenePhotosPage implements OnInit {
  sceneImages: any;
  imagePosition: Array<any>
  scenePhotos: string[];
  constructor(  
    public alertController: AlertController,
    private helpers: Helpers,
    private camera: Camera,
    private route: Router,
    private customeAlert: AlertsProviderService
  ) { 
      this.scenePhotos = [];
    }

  ngOnInit() {
    this.sceneImages = Array(9).fill(0, 0, 5);
    this.imagePosition = ["Front View", "Front Right Corner", "Front Right Door", "Rear Right Door",
    "Rear Right Corner","Rear View","Rear Left Corner","Rear Left Door","Front Left Door","Front Left Corner"]
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
        this.customeAlert.presentAlert("Oops", "Image Error", "Couldn't load image, please try again")
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
    this.route.navigate(["additional-content"]);
  }

  goBack(){
   
    this.route.navigateByUrl("accident-scene3");
  }

}
