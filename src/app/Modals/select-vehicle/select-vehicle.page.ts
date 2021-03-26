import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner/ngx";
import { Helpers } from "../../Helpers/helpers";
import { Storage } from "@ionic/storage";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { DriverDetails, VehicleDetails } from "../../models/appModels";
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';

@Component({
  selector: "app-select-vehicle",
  templateUrl: "./select-vehicle.page.html",
  styleUrls: ["./select-vehicle.page.scss"]
})
export class SelectVehiclePage implements OnInit {
  barcodeScannerOptions: BarcodeScannerOptions;
  scannedCarLicNum: any;
  isVehicleSet: boolean;
  loader: any;
  myVehicles: any = [];
  vehLogo: string;
  driverDetails: DriverDetails;
  constructor(
    private barcodeScanner: BarcodeScanner,
    private route: Router,
    public alertController: AlertController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    private alertprovider: AlertsProviderService,
    private _api: ApiGateWayService,
    private helpers: Helpers,
  ) {
  }



  ngOnInit() {

  }

  async ionViewWillEnter() {
    this._api.getDriver().then(driver => {
      console.log(driver)
      this.driverDetails = driver.data[0]
      this.loadVehicles(this.driverDetails.driverSpId);
    })
  }

  async loadVehicles(spID: any) {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present();
      this.vehLogo = this.helpers.vehIcon;
      this._api.getSpVehicleList(spID).subscribe(
        res => {
          if (res.body.status == true) this.myVehicles = res.body.data;
          loader.dismiss();
        },
        err => {
          loader.dismiss()
          this.alertprovider
            .presentAlert("Alert", "Information", "No Vehicles availale")
            .then(() => {
              this.route.navigateByUrl("app/tabs/tab3");
            });
        }
      );
    })
  }

  async confirmCar(index: any) {
    this.isVehicleSet = false;
    this.alertController.create({
      header: "Confirm Vehicle!",
      message:
        "Can You Confirm If This Is The Vehicle You Will Be Using!<br><p>Reg Number: " +
        this.myVehicles[index].registrationNumber +
        "</p><p>Vehicle Make: " +
        this.myVehicles[index].vehicleDescription +
        "</p>",
      buttons: [
        {
          text: "Disagree",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Agree",
          handler: () => {
            this.scanBarcode(index);
          }
        }
      ]
    }).then(alert => {
      alert.present();
    })
  }

  async scanBarcode(idx: any) {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present();
      this.barcodeScannerOptions = {
        showTorchButton: true,
        showFlipCameraButton: true,
        formats: "QR_CODE,PDF_417"
      };
      console.log("Opening scanner")
      this.barcodeScanner.scan(this.barcodeScannerOptions).then(
        barcodeData => {
          console.log("Finisshed scanning")
          loader.dismiss();
          let receivedData: string = JSON.stringify(barcodeData.text);
          let data = new Array();
          data = receivedData.split("%");
          this.scannedCarLicNum = data[6];
          console.log(this.scannedCarLicNum)
          console.log(this.myVehicles[idx].registrationNumber.split(" ").join(""))

          // if (this.scannedCarLicNum == this.myVehicles[idx].registrationNumber.split(" ").join("")) {
            if (true) {
            this._api.verifyVehicle(this.myVehicles[idx].registrationNumber.split(" ").join("")).then(response => {
              if (response.status) {
                this.isVehicleSet = true;
                this.storage.set("isVehicleSet", this.isVehicleSet).then(() => {
                  this.storage.set("clc_selectedVehicle", this.myVehicles[idx]).then(() => {
                    this.route.navigateByUrl("select-tel-number");
                  })
                });
              } else {
                this.alertprovider.presentAlert(
                  "Oops",
                  "Something went wrong",
                  "Could not assign you this vehicle, Please Try Again"
                );
              }
            }, err => {
              this.alertprovider.presentAlert(
                "Oops",
                "Something went wrong",
                "Could not assign you this vehicle, Please try again or contact CLC"
              );
            })
          } else {
            this.alertprovider.presentAlert(
              "Oops",
              "Vehicle Validation",
              "The Selected Vehicle Does Not Match The Scanned License Disk, Please Try Another Vehicle"
            );
          }

        },
        err => {
          loader.dismiss();
          console.log(err)
          this.alertprovider.presentAlert(
            "Oops",
            "Error",
            "Couldn't scan license disk, please try again"
          );
        }
      ).catch(
        err => {
          console.log("Error", err);
        });
    })
  }


  cancelCarSelection() {
    this.route.navigateByUrl("app/tabs/tab3");
  }
}
