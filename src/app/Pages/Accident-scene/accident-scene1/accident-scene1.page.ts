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
import { ClaimManager, CurrentClaim } from "src/app/Helpers/claim-manager";
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
  // claimDetails:iClaimDetails =  new iClaimDetails();
  claim: CurrentClaim = new CurrentClaim();
  constructor(
    private helpers: Helpers,
    private barcodeScanner: BarcodeScanner,
    private route: Router,
    private storage: Storage,
    private _api: ApiGateWayService,
    private loadingCtrl: LoadingController,
    private claimManager: ClaimManager
  ) {}

  async ngOnInit() {
    
  }

  async manualCarDetails() {  
    this.route.navigate(["accident-scene2"]);
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
        console.log(barcodeData)
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
  
  goBack() {
    this.route.navigateByUrl("/app/tabs/tab1");
  }
}
