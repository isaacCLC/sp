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
import { VehicleDetails } from "../../models/appModels";
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
  spDetails: any;
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

  ionViewWillEnter() {
    this.storage.get("clcSPDetails").then(res => {
      console.log(res)
      this.spDetails = res;
      this.loadVehicles(res.driverSpId);
    });
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
            .presentAlert("Information", "No Vehicles availale")
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
          handler: blah => {
            this.storage.set("isVehicleSet", this.isVehicleSet).then(data => {
              this.route.navigateByUrl("select-vehicle");
            });
          }
        },
        {
          text: "Agree",
          handler: () => {
            this.scanBarcode(index);
          }
        }
      ]
    }).then(alert=>{
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
          if (this.platform.is("android")) {
            // if (this.scannedCarLicNum == this.myVehicles[idx].registrationNumber.split(" ").join("")) {
            if (true) {
              this._api.verifyVehicle(this.spDetails.driverId, this.myVehicles[idx].registrationNumber.split(" ").join("")).subscribe(response=>{
                if(response.status){
                  this.isVehicleSet = true;
                  this.storage.set("isVehicleSet", this.isVehicleSet).then(() => {
                    this.storage.set("clc_selectedVehicle", this.myVehicles[idx]).then(()=>{
                      this.route.navigateByUrl("select-tel-number");
                    })
                  });
                }else{
                  this.alertprovider.presentAlert(
                    "Something went wrong",
                    "Could not assign you this vehicle, Please Try Again"
                  );    
                }
              },err=>{
                this.alertprovider.presentAlert(
                  "Something went wrong",
                  "Could not assign you this vehicle, Please try again or contact CLC"
                );
              })
            } else {
              this.alertprovider.presentAlert(
                "Vehicle Validation",
                "The Selected Vehicle Does Not Match The Scanned License Disk, Please Try Another Vehicle"
              );
            }
          } else {
            this.alertprovider.presentAlert(
              "Error",
              "Couldn't scan license disk, please try again"
            );
            // this.isVehicleSet = true;
            // this.storage.set("isVehicleSet", this.isVehicleSet).then(() => {
            //   this.route.navigateByUrl("select-tel-number");
            // });
            // this.storage.set("clc_selectedVehicle", this.myVehicles[idx]);
          }
        },
        err => {
          loader.dismiss();
          console.log(err)
          this.alertprovider.presentAlert(
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
