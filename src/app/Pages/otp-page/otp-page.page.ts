import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform, LoadingController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
@Component({
  selector: "app-otp-page",
  templateUrl: "./otp-page.page.html",
  styleUrls: ["./otp-page.page.scss"]
})
export class OtpPagePage implements OnInit {
  otpNum: any;
  cellNum: string = "";
  isOtpEntered: boolean;
  isCellEntered: boolean;
  enaableBth: boolean;
  cellValid: boolean;
  loader: any;
  generatedOtpNum: any;
  otpResend: boolean;
  spID: any;
  
  constructor(
    private route: Router,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private alertPvd: AlertsProviderService,
    private _api: ApiGateWayService
  ) {}

  ngOnInit() {
    this.isOtpEntered = false;
    this.isCellEntered = false;
    this.enaableBth = false;
    this.cellValid = true;
    this.otpResend = false;
    this.storage.get("clcDriverID").then(res => { 
      this.spID = res;
      this._api.getSPDetails(this.spID).subscribe(
        res => {  
           this.cellNum = res.data[0].driverContactNumber 
          if(this.cellNum.length > 9)
             this.enaableBth = true}
          )
    });
  }

  ionViewWillEnter() { 
  }

  async verifyOtp() {
    this.otpResend = false;
    console.log(this.otpNum + " gen:" + this.generatedOtpNum);
    this.loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    await this.loader.present();
    this._api.verifyOtp(this.spID, this.otpNum).subscribe(
      res => {
        console.log(res);
        if (res.status == 200 && res.body.status == true) {
          this.storage.set("clcOTP", this.otpNum);
          this.route.navigateByUrl("update-password");
        }
      },
      err => {
        console.log(err)
        this.loader.dismiss();
        this.alertPvd.presentAlert("OTP Error", "Wrong OTP Entered!");
      }
    );

    this.loader.dismiss();
  }

  async resendOTP() {
    this.otpNum = "";
    this.loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    await this.loader.present();
    await this._api.getOTP(this.spID, this.cellNum).subscribe(
      otpData => {},
      err => {
        this.alertPvd.presentAlert("OTP Error", "Error in generating OTP");
      }
    );
    this.loader.dismiss();
    this.otpResend = true;
  }
  onKeypress(evt) {
    this.isOtpEntered = true;
  }

  onKeyCellpress(evt) {
    if (this.cellNum != undefined) {
      if (this.cellNum.length >= 9) {
        this.enaableBth = true;
      } else {
        this.enaableBth = false;
      }
    }
  }
  async sendCellNum() {
    this.loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    await this.loader.present();
    var isnum = /^\d+$/.test(this.cellNum);
    if (isnum == true && this.cellNum.length == 10) {
      this.cellNum = this.cellNum.split(" ").join("");
      await this._api.getOTP(this.spID, this.cellNum).subscribe(
        otpData => {
          console.log(otpData);
          // if (otpData.body.status  == true  && otpData.status == true) {
          //   this.generatedOtpNum = otpData.body.optNum;
          //   this.cellValid = true;
          // } else {
          //   this.loader.dismiss();
          //   alert("Something Went Wrong, Please Try Again");
          // }
        },
        err => {
          this.alertPvd.presentAlert("OTP Error", "Error in generating OTP");
        }
      );
      this.loader.dismiss();
      this.isCellEntered = true;
    } else {
      this.loader.dismiss();
      this.cellValid = false;
    }
  }
}
