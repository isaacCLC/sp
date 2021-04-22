import { Component } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { AlertsProviderService } from "../../../providers/alerts-provider.service";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router"; 
import { GeneralService } from '../../../helpers/generals';
import { ApiGateWayService } from "src/app/providers/api-gate-way.service";
import { LoadingController } from "@ionic/angular";
import { Helpers } from "src/app/helpers/helpers";
@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page { 
  userProfile: any = [];
  private _genService:GeneralService
  constructor(
    private camera: Camera,
    private alerts: AlertsProviderService,
    private storage: Storage,
    private route: Router,
    private _api: ApiGateWayService,
    public loadingCtrl: LoadingController,
    private alertProvider: AlertsProviderService,
    private helpers: Helpers,
  ) { 
   this._genService = new GeneralService()
  }

  async ionViewWillEnter() { 
    this.loadingCtrl.create({
      message: "Loading..."
    }).then(loader => {
      loader.present()
        this._api.getDriver().then(spDetails => {
          console.log(spDetails)
          this.userProfile = spDetails.data[0];
          loader.dismiss()
        })
    })
  }

  updateProfile() {
    console.log(this.userProfile);
  }
  async logout() {
    this.loadingCtrl.create({
      message: "Logging Off..."
    }).then(loader => {
      loader.present();
      let userDetails = {
        driverId: this.userProfile.driverId
      }
      console.log("User details")
      console.log(this.userProfile)
      this._api.completeJOB().then(res => {
        if (res.status) {
          this._api.getDriverlogout(userDetails).then(res => {
            loader.dismiss()
            this.helpers.stopRequestCheck();
            this.helpers.stopWatchLocation();
            if (res.status) {
              this.storage.get("username").then(username => {
                this.storage.clear().then(() => {
                  this.storage.set("username", username)
                })
              })
              this.route.navigate(["/login"]);
            }
            else {
              this.alertProvider.presentAlert("Oops..", "Logout Error", res.data.errorMessage)
            }
          })
        }
        else {
          loader.dismiss()
          this.alertProvider.presentAlert("Oops..","Logout Error", res.data.errorMessage)
        }
      }, err => {
        loader.dismiss();
        this.alertProvider.presentAlert("Oops..","Error", "An Error has occured, Please contact your system administrtaor");
        return;
      })
    })
  }
  getImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      //  sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.userProfile.myphoto = "data:image/jpeg;base64," + imageData;
      },
      err => {
        // Handle error
        this.alerts.presentAlert("Oops..","Picture Error", "Could Not Get Your Image");
      }
    );
  } //end
}
