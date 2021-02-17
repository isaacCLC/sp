import { Component, OnInit, ViewChildren } from "@angular/core";
import { Platform, LoadingController, ModalController, IonItemSliding, IonButton } from "@ionic/angular";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { GeneralService } from "../../Helpers/generals";
import { AlertsProviderService } from '../../Providers/alerts-provider.service';
import { load } from 'google-maps';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { Helpers } from "src/app/Helpers/helpers";
import { DriverDetails } from "src/app/models/appModels";
import { UserState } from "src/app/Helpers/user-state";

@Component({
  selector: "app-select-tel-number",
  templateUrl: "./select-tel-number.page.html",
  styleUrls: ["./select-tel-number.page.scss"]
})
export class SelectTelNumberPage {
  contactDetails: any;
  cellNum: string;
  enaableBth: boolean;
  cellValid: boolean;
  loader: any;
  selectedNumber: any;
  isNumSelected: boolean;
  generals: GeneralService;
  driverDetails: DriverDetails;
  isNumDefault: boolean = false;
  @ViewChildren(IonItemSliding) slidingItems: any;
  alreadyVerified = []
  radioValue: any;
 

  constructor(
    private userState: UserState,
    private route: Router,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private _api: ApiGateWayService,
    private activatedRoute: ActivatedRoute,
    private alertProvider: AlertsProviderService,
    private helpers: Helpers
  ) {
    this.contactDetails = new Array();
    this.generals = new GeneralService();
    this.activatedRoute.queryParams.subscribe(params => {
      this.alreadyVerified.push(params['verified'])
    });
  }


  async ionViewDidEnter() {
    let firstTime = true;
    this.slidingItems.changes.subscribe((change) => {
      if (firstTime) {
        firstTime = false;

        let counter = 0;
        this.slidingItems.forEach(element => {
          setTimeout(() => { element.open() }, 100)
          counter = counter + 500
          setTimeout(() => { element.close() }, counter)
        });
      }
    });
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
        this._api.getDriver().then(
          res => {
            this.driverDetails = res.data[0]
            console.log(this.driverDetails)
            if (this.driverDetails.driverContactNumber) {
              this.contactDetails = [this.driverDetails.driverContactNumber]
            }
            this.driverDetails.driverAlternativeNumbers.forEach(element => {
              if (element.mobileNumber != this.driverDetails.driverContactNumber) {
                this.contactDetails.push(element.mobileNumber)
              }
            })
            this.enaableBth = false;
            this.cellValid = true;
            this.isNumSelected = false;
            loader.dismiss()

          }, err => {
            console.log(err);
            this.alertProvider.presentAlert("Oops", "Getting numbers error", "Something Went Wrong, Please Try Again")
          })
    })

  }




  onKeyCellpress(evt: any) {
    if (this.cellNum != undefined) {
      if (this.cellNum.length >= 9) {
        this.enaableBth = true;
      } else {
        this.enaableBth = false;
      }
    }
  }


  async selectCellNumber(verifired: boolean) {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      if (verifired) {
        this._api.addDiverNumber({
          mobileNumber: this.selectedNumber,
          driverId: this.driverDetails.driverId,
          useNumber: true
        }).then((response) => {
          loader.dismiss()
          if (response.status) {
            this.route.navigate(["app/tabs/tab3"]);
          }
        })
      } else {
        this.verifyNumber(this.selectedNumber, true, loader)
      }
    })
  }

  verifyNumber(number, confirmOnly: boolean, loader: any) {
    number = number.replace(/^(.{3})(.{3})(.*)$/, "$1 $2 $3").split(" ").join("");
    console.log(number)
    this._api.getOTP(number).then(
      otpData => {
        loader.dismiss()
        if (otpData.body.status == true) {
          this.route.navigate(["add-number-otp"], {
            queryParams: {
              confirm: confirmOnly,
              cellNum: number,
              default: this.isNumDefault
            }
          });
          this.cellNum = "";
        } else {
          alert("Something Went Wrong, Please Try Again");
        }
      }, err => {
        console.log(err)
        loader.dismiss()
        this.alertProvider.presentAlert("Oops","OTP Error", "Something Went Wrong, Please Try Again")
      })
  }


  async addCellNum() {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      let exisits = false;
      this.contactDetails.forEach(element => {
        if (element == this.cellNum) {
          exisits = true;
        }
      });
      if (!exisits) {
        if (this.generals.validateCell(this.cellNum)) {
          this.cellValid = true;
          this.cellNum = this.cellNum
          this.verifyNumber(this.cellNum, false, loader)
        } else {
          loader.dismiss();
          this.cellValid = false;
        }
      } else {
        loader.dismiss();
        this.alertProvider.presentAlert("Oops..","Duplicate Error", "This number already exists. Please select it on the list")
      }

    })

  }

  makeDefaulCheck(evt: any) {
    //code to make cell number default
    this.isNumDefault = true;
  }


  removeNumber(i: number) {
    let details = {
      mobileNumber: this.contactDetails[i],
      driverId: this.driverDetails.driverId,
      setInvalid: true
    }

    this._api.addDiverNumber(details).then(res => {
      if (res.status && res.data.updatedContact) {
        if (i = this.selectedNumber) {
          this.selectedNumber = ""
        }
        this._api.getDriver().then( //reload API and fetch updated contact details
          res => {
            this.driverDetails = res.data[0]
            this.contactDetails = [];
            this.contactDetails = [this.driverDetails.driverContactNumber];
            this.driverDetails.driverAlternativeNumbers.forEach(element =>
              this.contactDetails.push(element.mobileNumber));

            //   console.log(this.contactDetails)
          })
        this.alertProvider.presentAlert("Alert", "Info", "Cell number has been removed")
      }
    });

  }


}
