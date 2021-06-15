import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { Platform, LoadingController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { DriverDetails } from "src/app/models/appModels";
import { AlertsProviderService } from "../../providers/alerts-provider.service";
import { ApiGateWayService } from "../../providers/api-gate-way.service";

@Component({
  selector: "app-add-number-otp",
  templateUrl: "./add-number-otp.page.html",
  styleUrls: ["./add-number-otp.page.scss"]
})
export class AddNumberOtpPage implements OnInit {
  loader: any;
  isOtpEntered: boolean;
  otpNum: any;
  generatedOtpNum: any;
  cellNumber: any;
  otpResend: boolean = false;
  driverDetails: DriverDetails;
  isDefault: boolean;
  confirmOnly: string;
  countdown: number = 60;
  resendCountdown: false;

  constructor(
    private route: Router,
    private loadingCtrl: LoadingController,
    private alertPvd: AlertsProviderService,
    private activatedRoute: ActivatedRoute,
    private _api: ApiGateWayService,
    private storage: Storage,
    private smsRetriever: SmsRetriever

  ) {

  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this._api.getDriver().then(driver=>{
      this.driverDetails = driver.data[0]
      this.isOtpEntered = false;
      this.smsRetriever.startWatching()
        .then((res: any) => {
          this.otpNum = res.Message.match(/\b\d{4}\b/)[0];
          this.verifyOtp(this.otpNum)
        })
        .catch((error: any) => console.error(error));
      this.activatedRoute.queryParams.subscribe(params => {
        this.countdown = 60;
        setInterval(() => this.countdown--, 1000)
        this.cellNumber = params["cellNum"];
        this.isDefault = params["default"];
        this.confirmOnly = params['confirm']
      });
    })
 
  }

  async verifyOtp(otp: string) {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      console.log(this.driverDetails)
      this._api.verifyOtp(otp).then(
        verification => {
          loader.dismiss()
          if (verification.body.status == true) {
            if (this.confirmOnly == "true") {
              this._api.addDiverNumber({
                mobileNumber: this.cellNumber,
                driverId: this.driverDetails.driverId,
                useNumber: true
              }).then((response) => {
                loader.dismiss()
                console.log(response)
                if (response.status) {
                  this.route.navigate(["app/tabs/tab1"]);
                }
              })
            } else {
              console.log("ADding new")
              let details = {
                mobileNumber: this.cellNumber,
                driverId: this.driverDetails.driverId,
                default: this.isDefault
              }
              this._api.addDiverNumber(details).then(res => {
                loader.dismiss()
                if (res.status) {
                  this.alertPvd.presentAlert(
                    "Oops",
                    "Cell Number Added!",
                    "Your new cell number has been added successfully"
                  );
                  this.route.navigate(["select-tel-number"], {
                    queryParams: {
                      verified: this.cellNumber,
                    }
                  });
                } else {
                  this.alertPvd.presentAlert(
                    "Oops",
                    "Error",
                    "This Operation could not be performed, Please try again later."
                  );
                  this.route.navigate(["select-tel-number"]);
                }
              })
            }
          }
        },
        err => {
          console.log(err)
          loader.dismiss();
          this.alertPvd.presentAlert("Oops","OTP Error", "Wrong OTP Entered!");
        }
      );
    })
  }

  onKeypress(evt: any) {
    this.isOtpEntered = true;
  }

  onCodeCompleted(code: string) {
    console.log(code)
  }

  onCodeChanged

  async resendOTP() {
    this.otpNum = "";
    this.loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    await this.loader.present();
    await this._api.getOTP(this.cellNumber).then(otpData => {
      if (otpData.body.status == true) {
        this.otpResend = true;
        this.countdown = 60
      } else {
        this.loader.dismiss();
        alert("Something Went Wrong, Please Try Again");
      }

    }, err => { this.alertPvd.presentAlert("Oops","OTP Error", "Something Went Wrong, Please Try Again") })
    this.loader.dismiss();
  }

  goToHome() {
    this.otpNum = "";
    this.route.navigateByUrl("select-tel-number");
  }
}
