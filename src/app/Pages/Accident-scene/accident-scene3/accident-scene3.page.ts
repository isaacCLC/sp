import { Component, OnInit } from "@angular/core";
import { Helpers } from "../../..//Helpers/helpers";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Router } from "@angular/router";
import { AlertsProviderService } from "../../../Providers/alerts-provider.service";
import { AlertController } from "@ionic/angular";
@Component({
  selector: "app-accident-scene3",
  templateUrl: "./accident-scene3.page.html",
  styleUrls: ["./accident-scene3.page.scss"]
})
export class AccidentScene3Page implements OnInit {
  carAccidentimages: any;
  licenseDiskPath: string;
  scenePhotos: string[];
  photoOption: any;
  imagePosition: Array<any>
  numOfVeh:number;
  constructor(
    public alertController: AlertController,
    private helpers: Helpers,
    private camera: Camera,
    private route: Router,
    private customeAlert: AlertsProviderService
  ) {
    this.licenseDiskPath = null;
    this.scenePhotos = [];
      
    this.imagePosition = ["Front View", "Front Right Corner", "Front Right Door", "Rear Right Door",
    "Rear Right Corner","Rear View","Rear Left Corner","Rear Left Door","Front Left Door","Front Left Corner"]
  }

  ngOnInit() {
    this.carAccidentimages = Array(10).fill(0, 0, 5);
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
        this.customeAlert.presentAlert("Oops..", "Image Error", "Couldn't load image, please try again")
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
  vehLicPhoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.licenseDiskPath = "data:image/jpeg;base64," + imageData;
      },
      err => {
        this.customeAlert.presentAlert("Oops", "Image Error", "Couldn't load image, please try again")
        // Handle error
      }
    );
  }

  goBack() {
    this.route.navigateByUrl("accident-scene2");
  }
  postCarimages() {
    this.route.navigate(['scene-photos']);
  }
}
