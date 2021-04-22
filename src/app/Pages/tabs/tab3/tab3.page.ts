import { Component } from "@angular/core";
import {
  ModalController,
  NavController,
  LoadingController
} from "@ionic/angular";
import { ModalPage } from "../../../Modals/modal/modal.page";
import { Router } from "@angular/router";
import { Helpers } from "../../../Helpers/helpers";
import { Storage } from "@ionic/storage";
import { ApiGateWayService } from "../../../Providers/api-gate-way.service";
import { AlertsProviderService } from '../../../Providers/alerts-provider.service';
import { JsonPipe } from '@angular/common';
import { GeneralService } from '../../../Helpers/generals';
import { ReturnStatement } from '@angular/compiler';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page {
  loader: any;
  driverID: any;
  _generals: GeneralService = new GeneralService();
  mySelectedCar: any;
  spDetails: any;
  constructor(
    public modalController: ModalController,
    private route: Router,
    public navCtrl: NavController,
    private _api: ApiGateWayService,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private alertProvider: AlertsProviderService,
    public photoViewer: PhotoViewer,
    private helpers: Helpers,
  ) { }

  ngOnInit() {

  }

  async presentModal(props: any) {
    this.modalController.create({
      component: ModalPage,
      componentProps: { dataProperties: props }
    }).then(modal => {
      modal.present();
    })
  }

  async removeVehicle() {
    this.loadingCtrl.create({
      message: "Loading..."
    }).then(loader => {
      loader.present()
      this._api.getDriverlogout({ driverId: this.spDetails.driverId }).then(response => {
        loader.dismiss()
        if (response.status) {
          this.mySelectedCar = null;
        }
        else {
          this.alertProvider.presentAlert("Error removing vehicle","Could not remove vehicle Error", response.data.errorMessage)
        }
      })
    })
  }



  async ionViewWillEnter() {
    this.loadingCtrl.create({
      message: "Loading..."
    }).then(loader => {
      loader.present();
      this._api.getDriver().then(spDetails => {
        this.spDetails = spDetails.data[0];
        this.mySelectedCar = spDetails.data[0].driverVehicle
        console.log(this.mySelectedCar)
        // if (!("registration_number" in this.mySelectedCar)) {
        //   this.mySelectedCar = false;
        // }
        loader.dismiss();
      })
    })
  }

  async logout() {
    this.loadingCtrl.create({
      message: "Logging Off..."
    }).then(loader => {
      loader.present();
      let userDetails = {
        driverId: this.spDetails.driverId
      }
      console.log("User details")
      console.log(this.spDetails)
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

  changeVehicle() {
    this.route.navigateByUrl("select-vehicle");
  }
  chnageCellNum() {
    this.route.navigateByUrl("select-tel-number");
  }
}
