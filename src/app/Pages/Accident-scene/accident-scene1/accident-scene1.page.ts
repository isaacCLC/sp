import { Component, OnInit } from "@angular/core";
import { Helpers } from "../../../Helpers/helpers";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner/ngx";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ApiGateWayService } from "../../../Providers/api-gate-way.service";
import { LoadingController } from "@ionic/angular";
import { iClaimDetails } from '../../../models/appModels';
@Component({
  selector: "app-accident-scene1",
  templateUrl: "./accident-scene1.page.html",
  styleUrls: ["./accident-scene1.page.scss"]
})
export class AccidentScene1Page implements OnInit {
  dateObj: String = new Date().toISOString();
  myDate: any = this.dateObj;
  myTime: any;
  barcodeScannerOptions: BarcodeScannerOptions;
  accidentLocation: string;
  travellingSpeed: number;
  accidentDesc: string;
  loader: any;
  accidentLaccidentDesccation: String;
  claimDetails:iClaimDetails =  new iClaimDetails();
  constructor(
    private helpers: Helpers,
    private barcodeScanner: BarcodeScanner,
    private route: Router,
    private storage: Storage,
    private _api: ApiGateWayService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    await this.loader.present();
    await this.helpers.getCurrentLocation().then(data => {
      // TODO update location response
      // if (data.lat != 0) {
      //   this._api.getGeoCoding(data.lat, data.lng).subscribe(fullAddress => {
      //     this.claimDetails.incidentLocation = fullAddress.body.data.results[0].formatted_address;
      //   });
      // } else {
      //   this.claimDetails.incidentLocation  = "Location To Be Confirmed";
      // }
    });
    this.loader.dismiss();
    this.claimDetails.incidentDescription =""
  }

  register(data) {
    console.log(this.myDate);
  }

  async manualCarDetails() {  
    await this.storage.set("claimDetails",JSON.stringify(this.claimDetails)).then(()=>{
      this.route.navigate(["accident-scene2"]);
    })
 
  }

  scanBarcode() {
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true,
      formats: "QR_CODE,PDF_417"
    };
    this.barcodeScanner
      .scan(this.barcodeScannerOptions)
      .then(barcodeData => {
        this.storage.set("clcBarcodeData", barcodeData).then(data => { 
        this.storage.set("claimDetails",JSON.stringify(this.claimDetails))
          this.route.navigateByUrl("accident-scene2");
        });
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
  goBack() {
    this.route.navigateByUrl("/app/tabs/tab1");
  }
}
