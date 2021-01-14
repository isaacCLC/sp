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
import { load } from "google-maps";
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
  myNotifications: Array<Object>;
  constructor(
    public modalController: ModalController,
    private route: Router,
    public navCtrl: NavController,
    private _api: ApiGateWayService,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private alertProvider: AlertsProviderService,
    private photoViewer: PhotoViewer
  ) { }

  ngOnInit() {

  }

  async presentModal(props: any) {
    this.modalController.create({
      component: ModalPage,
      componentProps: { dataProperties: props }
    }).then(modal=>{
      modal.present();
    })
  }

  async removeVehicle() {
    this.loadingCtrl.create({
      message: "Loading..."
    }).then(loader => {
      loader.present()
      this._api.getDriverlogout({driverId: this.spDetails.driverId}).then(response => {
        loader.dismiss()
        if (response.status) {
          this.mySelectedCar = null;
        }
        else {
          this.alertProvider.presentAlert("Could not remove vehicle Error", response.data.errorMessage)
        }
      })
    })
  }



  async ionViewWillEnter() {
    this.loadingCtrl.create({
      message: "Loading..."
    }).then(loader => {
      loader.present();
      this.storage.get("_setCarFinalStage").then(data => {
        if (data == true) {
          loader.dismiss();
          this.route.navigate(["app/tabs/tab1"]);
          this.storage.remove("_setCarFinalStage");
        } else {
          this.myNotifications = new Array();
          this.storage.get("clcSPDetails").then(res => {
            this.spDetails = res.driverId;
            this.driverID = res.driverId
            this._api.getSPDetails(res.driverId).subscribe(spDetails => {
              this.spDetails = spDetails.data[0];
              this.mySelectedCar = spDetails.data[0].driverVehicle
              if (!("registration_number" in this.mySelectedCar)) {
                this.mySelectedCar = false;
              }
              loader.dismiss();
            })
          });
        }
      });

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
      this._api.completeJOB(userDetails.driverId).subscribe(res => {
        if (res.status) {
          this._api.getDriverlogout(userDetails).then(res => {
            loader.dismiss()
            if (res.status) {
              this.storage.clear()
              this.route.navigate(["/login"]);
            }
            else {
              this.alertProvider.presentAlert("Logout Error", res.data.errorMessage)
            }
          })
        }
        else {
          loader.dismiss()
          this.alertProvider.presentAlert("Logout Error", res.data.errorMessage)
        }
      }, err => {
        loader.dismiss();
        this.alertProvider.presentAlert("Error", "An Error has occured, Please contact your system administrtaor");
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
